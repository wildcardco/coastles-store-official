<template>
  <header class="sticky top-0 z-40 bg-gray-100">
    <div class="container flex items-center justify-between py-3">
      <div class="flex items-center gap-2">
        <MenuTrigger class="lg:hidden" />
        <Logo />
      </div>
      <div class="bg-coastles-800 rounded-full px-6 py-2 hidden lg:block">
        <MainMenu class="gap-6 text-sm font-medium text-white flex" />
      </div>
      <div class="flex items-center gap-4">
        <SignInLink />
        <CartTrigger />
      </div>
    </div>
  </header>
</template>
