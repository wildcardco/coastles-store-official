<script setup lang="ts">
// Nuxt auto-imports these composables, no need for explicit imports
const { siteName } = useAppConfig();
const runtimeConfig = useRuntimeConfig();
const img = useImage();

const logoUrl = runtimeConfig?.public?.LOGO ? img(runtimeConfig?.public?.LOGO) : '/logo/logo.png';
const faviconUrl = '/logo/logo.png';

// Set OG image meta
useSeoMeta({
  ogImage: logoUrl,
  twitterImage: logoUrl,
});
</script>

<template>
  <NuxtLink to="/" class="inline-flex items-center">
    <img :src="logoUrl" alt="Logo" class="w-full max-w-[150px] h-[40px] object-contain object-left" />
  </NuxtLink>
</template>
