export async function handleOptions(request) {
	const corsHeaders = {
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
		"Access-Control-Max-Age": "86400",
		"Access-Control-Allow-Headers": "Content-Type",
	}

	return new Response(null, {
		headers: corsHeaders,
	})

	// if (
	// 	request.headers.get('Origin') !== null &&
	// 	request.headers.get('Access-Control-Request-Method') !== null &&
	// 	request.headers.get('Access-Control-Request-Headers') !== null
	// ) {
	// 	// Handle CORS preflight requests.
	// 	return new Response(null, {
	// 		headers: corsHeaders,
	// 	});
	// } else {
	// 	// Handle standard OPTIONS request.
	// 	return new Response(null, {
	// 		headers: {
	// 			...corsHeaders,
	// 			Allow: 'GET, HEAD, POST, OPTIONS',
	// 		},
	// 	});
	// }
}
