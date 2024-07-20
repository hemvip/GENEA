// import * as Realm from 'realm-web';
import { corsHeaders } from './cors';
import { handleStartUpload } from './submission/upload-start';
import { handleUploadChunk } from './submission/upload-chunk';
import { handleCompleteUpload } from './submission/upload-complete';

// let App;
// const ObjectId = Realm.BSON.ObjectID;

export default {
	async fetch(request, env, ctx) {
		if (request.method === 'OPTIONS') {
			// Handle CORS preflight requests
			return new Response(null, { headers: corsHeaders });
		}

		if (request.method === 'GET') {
			return new Response(JSON.stringify({ message: 'It work' }), { headers: corsHeaders });
		}

		if (request.method === 'POST') {
			const url = new URL(request.url);

			if (url.pathname === '/api/start-upload') {
				return handleStartUpload(request, env);
			} else if (url.pathname === '/api/upload-part') {
				return handleUploadChunk(request, env);
			} else if (url.pathname === '/api/complete-upload') {
				return handleCompleteUpload(request, env);
			}
			return new Response('Success', { status: 200, headers: corsHeaders });
		}

		return new Response('Not Found', { status: 404 });
		// App = App || new Realm.App(env.ATLAS_APPID);
		// const method = request.method;
		// const path = url.pathname.replace(/[/]$/, '');

		// if (path !== '/api/submission') {
		// 	return responseError(`Unknown '${path}' URL; try '/api/submission' instead.`, 404);
		// }

		// // const token = request.headers.get('authorization');
		// const token = 'XnabV4Pa2RV6lgyJAj0uAun6X5KM6p0yJceHEm3EJ80757sasEjpP2smYNJaSkcv';
		// if (!token) return responseError(`Missing 'authorization' header; try to add the header 'authorization: ATLAS_APP_API_KEY'.`);
		// try {
		// 	const credentials = Realm.Credentials.apiKey(token);
		// 	// Attempt to authenticate
		// 	var user = await App.logIn(credentials);
		// 	var client = user.mongoClient('mongodb-atlas');
		// } catch (err) {
		// 	return responseError('Error with authentication.', 500);
		// }

		// try {
		// 	// POST /api/submission
		// 	if (path === '/api/submission' && method === 'POST') {
		// 		console.log('Start upload');

		// 		// const { errors, success, msg } = await handleUpload(client, request, env);
		// 		const { errors, success, msg } = await handleUpload(request, env);
		// 		// console.log(errors, success, data, msg)
		// 		return responseJSON({ errors, success, msg });
		// 	}
		// 	// unknown method
		// 	return responseError('Method not allowed.', 405);
		// } catch (err) {
		// 	console.log(err);
		// 	return responseError({
		// 		errors: err,
		// 		success: false,
		// 		data: null,
		// 		msg: 'Internal server error',
		// 	});
		// }
	},
};
