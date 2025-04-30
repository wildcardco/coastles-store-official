export async function onRequest(context) {
  const { request } = context;
  const WORDPRESS_URL = 'https://admin.coastles.store';
  const ALLOWED_ORIGINS = [
    'https://coastles.store',
    'https://www.coastles.store',
    'https://coastles-store-official.pages.dev'
  ];

  // Determine the origin
  const origin = request.headers.get('Origin') || '*';
  
  // Set CORS headers based on the origin
  const corsHeaders = {
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-WP-Nonce',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
  };

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, { 
      headers: corsHeaders,
      status: 204
    });
  }

  try {
    // Forward the request to WordPress GraphQL
    const wpRequest = new Request(`${WORDPRESS_URL}/graphql`, {
      method: request.method,
      headers: {
        ...Object.fromEntries(request.headers),
        'Origin': WORDPRESS_URL,
        'Host': new URL(WORDPRESS_URL).host,
      },
      body: request.body,
    });

    const response = await fetch(wpRequest);
    
    if (!response.ok) {
      throw new Error(`WordPress returned ${response.status}`);
    }

    // Create a new response with the WordPress response and add CORS headers
    const newResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        ...Object.fromEntries(response.headers),
        ...corsHeaders,
      },
    });

    return newResponse;
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Error proxying to WordPress',
      details: error.message 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }
} 