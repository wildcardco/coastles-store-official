export async function onRequest(context) {
  const { request } = context;
  
  // Add CORS headers to all responses
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
  };

  // Handle OPTIONS request for CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  // Forward the request to WordPress
  if (request.url.includes('/graphql')) {
    const wpRequest = new Request('https://admin.coastles.store/graphql', {
      method: request.method,
      headers: request.headers,
      body: request.body,
    });
    
    const response = await fetch(wpRequest);
    const newResponse = new Response(response.body, response);
    
    // Add CORS headers to the response
    Object.entries(corsHeaders).forEach(([key, value]) => {
      newResponse.headers.set(key, value);
    });
    
    return newResponse;
  }

  // For all other requests, continue to the static assets
  return context.next();
} 