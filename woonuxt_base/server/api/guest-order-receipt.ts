import { defineEventHandler, getQuery, createError } from 'h3';

export default defineEventHandler(async (event) => {
  const { orderId, orderKey } = getQuery(event);
  const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY;
  const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET;
  const apiBaseUrl = process.env.WOOCOMMERCE_API_URL;

  if (!orderId || !orderKey) {
    throw createError({ statusCode: 400, statusMessage: 'Missing orderId or orderKey' });
  }

  if (!apiBaseUrl) {
    throw createError({ statusCode: 500, statusMessage: 'WOOCOMMERCE_API_URL is not set in environment variables' });
  }

  const apiUrl = `${apiBaseUrl}/wp-json/wc/v3/orders/${orderId}?order_key=${orderKey}`;

  try {
    const order = await $fetch(apiUrl, {
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64'),
      },
    });
    return order;
  } catch (error: any) {
    throw createError({
      statusCode: error?.response?.status || 500,
      statusMessage: error?.response?._data?.message || 'Failed to fetch order',
    });
  }
}); 