<script setup lang="ts">
const { toggleMobileMenu } = useHelpers();
</script>

<template>
  <div class="bg-gray-100 flex flex-col max-w-lg shadow-lg top-0 bottom-0 left-0 w-11/12 z-50 fixed overflow-x-hidden">
    <CloseIcon class="bg-gray-100 rounded-xl shadow-xl p-1.5 m-4" @click="toggleMobileMenu(false)" />
    <div class="mt-8 text-center font-heading italic text-xl">Menu</div>
    <MainMenu class="m-4 grid p-4 text-gray-700 gap-6 font-medium" />
    <div class="mt-auto text-center p-8 text-[10px] text-gray-500">
      © 2025 Coastles Clothing
    </div>
  </div>
</template>
