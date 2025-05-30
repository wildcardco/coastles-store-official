/**
 * App configuration.
 * This file is used to configure the app settings.
 * Below are the default values.
 */
export default defineAppConfig({
  siteName: 'Coastles Store',
  shortDescription: 'Premium streetwear designed for those who dare to stand out. Discover our collection of high-quality anime-inspired clothing.',
  description: `Discover our collection of premium streetwear designed for those who dare to stand out. Coastles offers unique, anime-inspired designs crafted with high-quality materials. Each piece embodies bold self-expression and otaku culture.`,
  baseUrl: 'https://coastles.store',
  siteImage: '/logo/logo.png',
  storeSettings: {
    autoOpenCart: false,
    showReviews: true,
    showFilters: true,
    showOrderByDropdown: true,
    showSKU: true,
    showRelatedProducts: true,
    showProductCategoriesOnSingleProduct: true,
    showBreadcrumbOnSingleProduct: true,
    showMoveToWishlist: true,
    hideBillingAddressForVirtualProducts: false,
    initStoreOnUserActionToReduceServerLoad: true,
    saleBadge: 'percent', // 'percent', 'onSale' or 'hidden'
    socialLoginsDisplay: 'buttons', // 'buttons' or 'icons'
  },
});
