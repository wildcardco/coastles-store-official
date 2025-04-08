<script setup lang="ts">
const { wishlistLink } = useAuth();
</script>

<template>
  <nav>
    <NuxtLink to="/">{{ $t('messages.general.home') }}</NuxtLink>
    <NuxtLink to="/products">{{ $t('messages.general.allProducts') }}</NuxtLink>
    <NuxtLink class="lg:hidden" :to="wishlistLink" :prefetch="false">Wishlist</NuxtLink>
    <NuxtLink class="lg:hidden" to="/my-account" :prefetch="false">My Account</NuxtLink>
  </nav>
</template>
