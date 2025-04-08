<script lang="ts" setup>
import { StockStatusEnum, ProductTypesEnum, type AddToCartInput } from '#woo';

const route = useRoute();
const { storeSettings } = useAppConfig();
const { arraysEqual, formatArray, checkForVariationTypeOfAny } = useHelpers();
const { addToCart, isUpdatingCart } = useCart();
const { t } = useI18n();
const slug = route.params.slug as string;

const { data } = await useAsyncGql('getProduct', { slug });
if (!data.value?.product) {
  throw showError({ statusCode: 404, statusMessage: t('messages.shop.productNotFound') });
}

const product = ref<Product>(data?.value?.product);
const quantity = ref<number>(1);
const activeVariation = ref<Variation | null>(null);
const variation = ref<VariationAttribute[]>([]);
const indexOfTypeAny = computed<number[]>(() => checkForVariationTypeOfAny(product.value));
const attrValues = ref();
const isSimpleProduct = computed<boolean>(() => product.value?.type === ProductTypesEnum.SIMPLE);
const isVariableProduct = computed<boolean>(() => product.value?.type === ProductTypesEnum.VARIABLE);
const isExternalProduct = computed<boolean>(() => product.value?.type === ProductTypesEnum.EXTERNAL);

const type = computed(() => activeVariation.value || product.value);
const selectProductInput = computed<any>(() => ({ productId: type.value?.databaseId, quantity: quantity.value })) as ComputedRef<AddToCartInput>;

const mergeLiveStockStatus = (payload: Product): void => {
  product.value.stockStatus = payload.stockStatus ?? product.value?.stockStatus;

  payload.variations?.nodes?.forEach((variation: Variation, index: number) => {
    if (product.value?.variations?.nodes[index]) {
      product.value.variations.nodes[index].stockStatus = variation.stockStatus;
    }
  });
};

onMounted(async () => {
  try {
    const { product } = await GqlGetStockStatus({ slug });
    if (product) mergeLiveStockStatus(product as Product);
  } catch (error: any) {
    const errorMessage = error?.gqlErrors?.[0].message;
    if (errorMessage) console.error(errorMessage);
  }
});

const updateSelectedVariations = (variations: VariationAttribute[]): void => {
  if (!product.value.variations) return;

  attrValues.value = variations.map((el) => ({ attributeName: el.name, attributeValue: el.value }));
  const clonedVariations = JSON.parse(JSON.stringify(variations));
  const getActiveVariation = product.value.variations?.nodes.filter((variation: any) => {
    // If there is any variation of type ANY set the value to ''
    if (variation.attributes) {
      // Set the value of the variation of type ANY to ''
      indexOfTypeAny.value.forEach((index) => (clonedVariations[index].value = ''));

      return arraysEqual(formatArray(variation.attributes.nodes), formatArray(clonedVariations));
    }
  });

  // Set variation to the selected variation if it exists
  activeVariation.value = getActiveVariation?.[0] || null;

  selectProductInput.value.variationId = activeVariation.value?.databaseId ?? null;
  selectProductInput.value.variation = activeVariation.value ? attrValues.value : null;
  variation.value = variations;
};

const stockStatus = computed(() => {
  if (isVariableProduct.value) {
    return activeVariation.value?.stockStatus || StockStatusEnum.OUT_OF_STOCK;
  }
  return type.value?.stockStatus || StockStatusEnum.OUT_OF_STOCK;
});

const disabledAddToCart = computed(() => {
  const isOutOfStock = stockStatus.value === StockStatusEnum.OUT_OF_STOCK;
  const isInvalidType = !type.value;
  const isCartUpdating = isUpdatingCart.value;
  const isValidActiveVariation = isVariableProduct.value ? !!activeVariation.value : true;
  return isInvalidType || isOutOfStock || isCartUpdating || !isValidActiveVariation;
});
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <SEOHead 
      :info="product"
      :title="`${type.name} - Coastles`"
      :description="product.shortDescription || 'Premium streetwear by Coastles. High-quality materials, unique designs, and California-inspired style.'"
      :image="product.image?.sourceUrl"
      type="product"
      :keywords="`${type.name}, Coastles clothing, premium streetwear, California style, ${product.productCategories?.nodes?.map(cat => cat.name).join(', ')}`"
    />
    <Breadcrumb :product="product" class="mb-6" v-if="storeSettings.showBreadcrumbOnSingleProduct" />

    <div class="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-2">
      <!-- Product Images -->
      <div class="lg:col-start-1 lg:col-span-1">
        <ProductImageSlider
          v-if="product.image"
          :main-image="product.image"
          :gallery="product.galleryImages"
          :node="type" />
        <NuxtImg v-else class="relative w-full skeleton rounded-lg" src="/images/placeholder.jpg" :alt="product?.name || 'Product'" />
      </div>

      <!-- Product Info -->
      <div class="lg:col-start-2 lg:col-span-1">
        <h1 class="text-4xl font-heading italic font-medium text-gray-900">{{ type.name }}</h1>
        <LazyWPAdminLink :link="`/wp-admin/post.php?post=${product.databaseId}&action=edit`">Edit</LazyWPAdminLink>
        
        <!-- Rating -->
        <!-- <StarRating :rating="product.averageRating || 0" :count="product.reviewCount || 0" v-if="storeSettings.showReviews" class="mt-2" /> -->
        
        <!-- Price -->
        <div class="mt-4">
          <ProductPrice class="text-2xl font-bold text-red-600" :sale-price="type.salePrice" :regular-price="type.regularPrice" />
        </div>

        <!-- Stock Status -->
        <div class="mt-2" v-if="!isExternalProduct">
          <StockStatus :stockStatus="stockStatus" @updated="mergeLiveStockStatus" class="text-sm" />
        </div>

        <!-- SKU -->
        <div class="mt-2 text-sm text-gray-600" v-if="storeSettings.showSKU && product.sku">
          <span>{{ $t('messages.shop.sku') }}: {{ product.sku || 'N/A' }}</span>
        </div>

        <!-- Description -->
        <div class="mt-6 prose prose-sm text-gray-700" v-html="product.shortDescription || product.description" />

        <hr class="my-8" />

        <!-- Variant Selection -->
        <AttributeSelections
          v-if="isVariableProduct && product.attributes && product.variations"
          class="mt-8"
          :attributes="product.attributes.nodes"
          :defaultAttributes="product.defaultAttributes"
          :variations="product.variations.nodes"
          @attrs-changed="updateSelectedVariations" />

        <!-- Quantity Selector -->
        <div v-if="isVariableProduct || isSimpleProduct" class="mt-8">
          <div class="flex rounded-md shadow-sm">
            <button 
              @click="quantity > 1 && quantity--"
              class="relative -mr-px inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              :disabled="disabledAddToCart"
            >
              −
            </button>
            <input
              v-model="quantity"
              type="number"
              min="1"
              :max="type.stockQuantity || 999999"
              class="block w-20 border-gray-300 text-center focus:ring-primary focus:border-primary sm:text-sm"
              :disabled="disabledAddToCart"
              @change="quantity = Math.min(Math.max(1, quantity), type.stockQuantity || 999999)"
            />
            <button 
              @click="quantity < (type.stockQuantity || 999999) && quantity++"
              class="relative -ml-px inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              :disabled="disabledAddToCart || quantity >= (type.stockQuantity || 999999)"
            >
              +
            </button>
          </div>
          <p v-if="type.stockQuantity" class="mt-2 text-sm text-gray-600">
            {{ type.stockQuantity }} {{ $t('messages.shop.inStock') }}
          </p>
        </div>

        <!-- Add to Cart Button -->
        <div class="mt-8">
          <form @submit.prevent="addToCart(selectProductInput)">
            <AddToCartButton 
              class="w-full rounded-lg font-bold bg-gray-800 text-white text-center p-2.5 hover:bg-gray-700" 
              :disabled="disabledAddToCart" 
              :class="{ loading: isUpdatingCart }" 
            />
          </form>
        </div>

        <!-- External Product Link -->
        <a
          v-if="isExternalProduct && product.externalUrl"
          :href="product.externalUrl"
          target="_blank"
          class="mt-8 block rounded-lg font-bold bg-gray-800 text-white text-center p-2.5 hover:bg-gray-700">
          {{ product?.buttonText || 'View product' }}
        </a>

        <!-- Categories -->
        <div v-if="storeSettings.showProductCategoriesOnSingleProduct && product.productCategories" class="mt-8">
          <hr class="mb-4" />
          <div class="text-sm text-gray-600">
            <span>{{ $t('messages.shop.category', 2) }}: </span>
            <div class="product-categories inline">
              <NuxtLink
                v-for="category in product.productCategories.nodes"
                :key="category.databaseId"
                :to="`/product-category/${decodeURIComponent(category?.slug || '')}`"
                class="hover:text-primary"
                :title="category.name"
                >{{ category.name }}<span class="comma">, </span>
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-wrap gap-4 mt-8">
          <WishlistButton :product="product" />
          <ShareButton :product="product" />
        </div>
      </div>
    </div>

    <!-- Product Tabs -->
    <!-- <div v-if="product.description || product.reviews" class="mt-32">
      <ProductTabs :product="product" />
    </div> -->

    <!-- Related Products -->
    <!-- <div class="mt-32" v-if="product.related && storeSettings.showRelatedProducts">
      <div class="mb-4 text-xl font-semibold">{{ $t('messages.shop.youMayLike') }}</div>
      <LazyProductRow :products="product.related.nodes" class="grid-cols-2 md:grid-cols-4 lg:grid-cols-5" />
    </div> -->
  </div>
</template>

<style lang="postcss" scoped>
.product-categories > a:last-child .comma {
  display: none;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

.loading {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
