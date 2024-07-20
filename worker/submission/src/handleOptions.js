export async function handleOptions(request) {
	const corsHeaders = {
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
		'Access-Control-Allow-Credentials': 'true',
		'Access-Control-Max-Age': '86400',
		'Access-Control-Request-Method': '*', // request.headers.get('Access-Control-Request-Method'),
		'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, X-PINGOTHER',
		'Access-Control-Request-Headers': 'content-type,x-pingother,x-requested-with,authorization',
	};

	return new Response(null, {
		headers: corsHeaders,
	});

	// if (
	// 	request.headers.get('Origin') !== null &&
	// 	request.headers.get('Access-Control-Request-Method') !== null &&
	// 	request.headers.get('Access-Control-Request-Headers') !== null
	// ) {
	// 	// Handle CORS preflight requests.
	// 	return new Response(null, {
	// 		headers: {
	// 			...corsHeaders,
	// 			'Access-Control-Allow-Headers': request.headers.get('Access-Control-Request-Headers'),
	// 		},
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
