export default defineNuxtConfig({

  // Get all the pages, components, composables and plugins from the parent theme
  extends: ['./woonuxt_base'],

  components: [{ path: './components', pathPrefix: false }],

  app: {
    head: {
      meta: [
        { property: 'og:site_name', content: 'Coastles Store' },
        { property: 'og:title', content: 'Coastles Store - Premium Streetwear' },
        { property: 'og:description', content: 'Premium streetwear designed for those who dare to stand out. Discover our collection of high-quality anime-inspired clothing.' },
        { property: 'og:image', content: '/logo/logo.png' },
        { property: 'og:url', content: 'https://coastles.store' },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Coastles Store - Premium Streetwear' },
        { name: 'twitter:description', content: 'Premium streetwear designed for those who dare to stand out. Discover our collection of high-quality anime-inspired clothing.' },
        { name: 'twitter:image', content: '/logo/logo.png' },
        { name: 'description', content: 'Premium streetwear designed for those who dare to stand out. Discover our collection of high-quality anime-inspired clothing.' }
      ],
    },
  },

  /**
   * Depending on your servers capabilities, you may need to adjust the following settings.
   * It will affect the build time but also increase the reliability of the build process.
   * If you have a server with a lot of memory and CPU, you can remove the following settings.
   * @property {number} concurrency - How many pages to prerender at once
   * @property {number} interval - How long to wait between prerendering pages
   * @property {boolean} failOnError - This stops the build from failing but the page will not be statically generated
   */
  nitro: {
    prerender: {
      concurrency: 10,
      interval: 1000,
      failOnError: false,
    },
  },

  runtimeConfig: {
    public: {
      siteOpenTime: process.env.SITE_OPEN_TIME || '2024-06-13T21:00:00-05:00', // June 13th, 9PM Central
      siteCloseTime: process.env.SITE_CLOSE_TIME || '2024-06-15T21:00:00-05:00', // June 15th, 9PM Central
    }
  },
});
