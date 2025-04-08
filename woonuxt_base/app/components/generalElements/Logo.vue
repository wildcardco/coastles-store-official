<script setup lang="ts">
// Nuxt auto-imports these composables, no need for explicit imports
const { siteName } = useAppConfig();
const runtimeConfig = useRuntimeConfig();
const img = useImage();

const logoUrl = runtimeConfig?.public?.LOGO ? img(runtimeConfig?.public?.LOGO) : null;
const faviconUrl = '/logo/logo.png';
</script>

<template>
  <NuxtLink to="/" class="inline-flex items-center">
    <img v-if="logoUrl" :src="logoUrl" alt="Logo" class="w-full max-w-[150px] h-[40px] object-contain object-left" />
    <div v-else class="flex items-center">
      <img :src="faviconUrl" alt="Logo" class="w-full max-w-[150px] h-[65px] object-contain object-left" />
    </div>
  </NuxtLink>
</template>
