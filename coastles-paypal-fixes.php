<?php
/**
 * Plugin Name: Coastles PayPal Fixes
 * Description: Custom fixes for PayPal integration with WooNuxt
 * Version: 1.0.0
 * Author: Coastles
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Fix PayPal redirect for headless checkout
add_action('woocommerce_api_wc_gateway_paypal', 'fix_paypal_headless_redirect', 5);

function fix_paypal_headless_redirect() {
    // Check if this is a PayPal return
    if (isset($_GET['token']) && isset($_GET['PayerID'])) {
        // Get the order from PayPal token
        $order_id = get_paypal_order_id_from_token($_GET['token']);
        
        if ($order_id) {
            $order = wc_get_order($order_id);
            if ($order) {
                // Redirect to your frontend success page instead of WP admin
                $redirect_url = 'https://www.coastles.store/checkout/order-received/' . $order_id . '/?key=' . $order->get_order_key() . '&from_paypal=true';
                wp_redirect($redirect_url);
                exit;
            }
        }
    }
}

// Store PayPal token with order for retrieval
add_action('woocommerce_checkout_update_order_meta', function($order_id) {
    if (isset($_POST['paypal_token'])) {
        update_post_meta($order_id, '_paypal_token', sanitize_text_field($_POST['paypal_token']));
    }
});

function get_paypal_order_id_from_token($token) {
    global $wpdb;
    return $wpdb->get_var($wpdb->prepare(
        "SELECT post_id FROM {$wpdb->postmeta} WHERE meta_key = '_paypal_token' AND meta_value = %s",
        $token
    ));
}

// Add CORS headers for frontend communication
add_action('init', 'add_cors_headers');

function add_cors_headers() {
    if (isset($_SERVER['HTTP_ORIGIN'])) {
        header("Access-Control-Allow-Origin: https://www.coastles.store");
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
        header("Access-Control-Allow-Credentials: true");
        header("Access-Control-Allow-Headers: Content-Type, Authorization");
    }
}

// Add PayPal fields to WPGraphQL
add_filter('graphql_woocommerce_order_fields', 'add_paypal_fields_to_order', 10, 1);

function add_paypal_fields_to_order($fields) {
    $fields['paypalToken'] = [
        'type' => 'String',
        'description' => 'PayPal token for the order',
        'resolve' => function($order) {
            return get_post_meta($order->get_id(), '_paypal_token', true);
        }
    ];
    return $fields;
}

// Add PayPal transaction logging
add_action('woocommerce_paypal_express_checkout_process_payment', 'log_paypal_transaction', 10, 2);

function log_paypal_transaction($order_id, $transaction) {
    if (defined('WP_DEBUG') && WP_DEBUG) {
        error_log('PayPal Transaction for Order #' . $order_id . ': ' . print_r($transaction, true));
    }
}
