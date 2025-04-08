<script setup lang="ts">
const route = useRoute();
const { error } = defineProps<{ error: any }>();
const { isShowingCart, toggleCart } = useCart();
const { isShowingMobileMenu, toggleMobileMenu, addBodyClass, removeBodyClass } = useHelpers();
const { setProducts, updateProductList } = useProducts();

const { data } = await useAsyncGql('getProducts');
const allProducts = data.value?.products?.nodes as Product[];
setProducts(allProducts);

const closeCartAndMenu = () => {
  toggleCart(false);
  toggleMobileMenu(false);
};

watch([isShowingCart, isShowingMobileMenu], () => {
  isShowingCart.value || isShowingMobileMenu.value ? addBodyClass('overflow-hidden') : removeBodyClass('overflow-hidden');
});

watch(
  () => route.path,
  () => closeCartAndMenu(),
);

useSeoMeta({
  title: error?.statusCode ? `Error ${error.statusCode} - Coastles Clothing` : 'Page Not Found - Coastles Clothing',
  description: error?.message || 'The page you are looking for could not be found.',
});
</script>

<template>
  <div class="flex flex-col min-h-screen bg-gray-100">
    <AppHeader />

    <Transition name="slide-from-right">
      <LazyCart v-if="isShowingCart" />
    </Transition>

    <Transition name="slide-from-left">
      <LazyMobileMenu v-if="isShowingMobileMenu" />
    </Transition>

    <div class="flex flex-col items-center justify-center gap-8 px-4 py-20">
      <div class="text-center">
        <h1 class="text-8xl font-bold text-coastles-800 mb-4">404</h1>
        <h2 class="text-2xl font-medium text-gray-700 mb-2">Page Not Found</h2>
        <p class="text-gray-500 max-w-md mx-auto">
          {{ error?.message || "We couldn't find the page you're looking for. Let's get you back on track." }}
        </p>
      </div>
      <div class="flex gap-4">
        <NuxtLink to="/" class="bg-coastles-800 text-white px-6 py-3 rounded-full hover:bg-coastles-900 transition-colors">
          Return Home
        </NuxtLink>
        <NuxtLink to="/products" class="bg-white text-coastles-800 border border-coastles-800 px-6 py-3 rounded-full hover:bg-gray-50 transition-colors">
          Shop Now
        </NuxtLink>
      </div>

      <div v-if="allProducts?.length" class="w-full max-w-3xl mx-auto mt-16">
        <h2 class="text-2xl font-medium text-gray-800 text-center mb-12">Looking for products?</h2>
        <div class="flex justify-center px-4">
          <div class="w-full max-w-[280px]">
            <ProductGrid />
          </div>
        </div>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="isShowingCart || isShowingMobileMenu" class="bg-black opacity-25 inset-0 z-40 fixed" @click="closeCartAndMenu" />
    </Transition>
  </div>
</template>

<style scoped>
.slide-from-right-enter-active,
.slide-from-right-leave-active,
.slide-from-left-enter-active,
.slide-from-left-leave-active {
  transition: transform 0.3s ease;
}

.slide-from-right-enter-from,
.slide-from-right-leave-to {
  transform: translateX(100%);
}

.slide-from-left-enter-from,
.slide-from-left-leave-to {
  transform: translateX(-100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
