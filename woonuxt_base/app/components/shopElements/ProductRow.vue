<script setup>
const props = defineProps({
  products: { type: Array, default: null },
});
</script>

<template>
  <div v-if="products" class="grid gap-8">
    <ProductCard
      v-for="(node, i) in products"
      :key="node.databaseId"
      class="w-full"
      :node="node"
      :index="i"
    />
  </div>
</template>
