<script setup lang="ts">
import { nextTick } from 'vue';
const { cart } = useCart();
const { stripe } = defineProps(['stripe']);

// Ensure amount is always an integer (in cents)
const rawCartTotal = computed(() => cart.value && Math.round(parseFloat(cart.value.rawTotal as string) * 100));
const emit = defineEmits(['updateElement']);
let elements = null as any;
const clientSecret = ref('');
const loading = ref(true);
const errorMsg = ref('');

const options = computed(() => ({
  clientSecret: clientSecret.value,
  appearance: {
    theme: 'stripe',
    variables: {
      colorPrimary: '#ff0000',
    },
  },
}));

const createStripeElements = async () => {
  try {
    if (!stripe || !clientSecret.value) return;
    await nextTick(); // Wait for DOM to update
    elements = stripe.elements(options.value);
    const paymentElement = elements.create('payment');
    paymentElement.mount('#payment-element-inner');
    emit('updateElement', elements);
    loading.value = false;
  } catch (error) {
    errorMsg.value = 'Error mounting payment form.';
    console.error('Error mounting Stripe PaymentElement:', error);
    loading.value = false;
  }
};

const fetchPaymentIntent = async () => {
  loading.value = true;
  try {
    const { data, error } = await useFetch('/api/create-payment-intent', {
      method: 'POST',
      body: {
        amount: rawCartTotal.value,
        currency: 'usd',
      },
    });
    if (error.value) {
      errorMsg.value = 'Error fetching payment intent.';
      console.error('API error:', error.value);
      loading.value = false;
      return;
    }
    if (data.value?.clientSecret) {
      clientSecret.value = data.value.clientSecret;
    } else {
      errorMsg.value = 'No client secret returned from server.';
      loading.value = false;
    }
  } catch (error) {
    errorMsg.value = 'Error fetching payment intent.';
    console.error('Error fetching payment intent:', error);
    loading.value = false;
  }
};

watch(clientSecret, (newVal) => {
  if (stripe && newVal) {
    createStripeElements();
  }
});

onMounted(() => {
  fetchPaymentIntent();
});
</script>

<template>
  <div id="payment-element">
    <div v-if="loading">Loading payment form...</div>
    <div v-else-if="errorMsg" class="text-red-500">{{ errorMsg }}</div>
    <div id="payment-element-inner" v-show="!loading && !errorMsg"></div>
  </div>
</template>
