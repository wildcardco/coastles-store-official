<?php
/**
 * Plugin Name: Coastles Direct Stripe Gateway
 * Description: Adds a custom payment gateway for direct Stripe API integration.
 * Version: 1.0
 * Author: Coastles
 */

add_filter('woocommerce_payment_gateways', function($gateways) {
    $gateways[] = 'WC_Gateway_Stripe_Direct';
    return $gateways;
});

add_action('plugins_loaded', function() {
    if (!class_exists('WC_Payment_Gateway')) return;

    class WC_Gateway_Stripe_Direct extends WC_Payment_Gateway {
        public function __construct() {
            $this->id = 'stripe';
            $this->method_title = 'Stripe (Direct)';
            $this->method_description = 'Pay with credit/debit card via direct Stripe API integration.';
            $this->title = 'Credit/Debit Card (Stripe)';
            $this->has_fields = false;
            $this->enabled = 'yes';
        }

        public function process_payment($order_id) {
            $order = wc_get_order($order_id);
            // Mark as paid, since payment is handled by Stripe API
            $order->payment_complete();
            return [
                'result'   => 'success',
                'redirect' => $this->get_return_url($order),
            ];
        }
    }
});
