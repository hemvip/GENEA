import { corsHeaders } from "./cors"
import { handleVideoStartUpload } from "./video/upload-start"
import { handleVideoUploadChunk } from "./video/upload-chunk"
import { handleVideoCompleteUpload } from "./video/upload-complete"

export default {
	async fetch(request, env, ctx) {
		if (request.method === "OPTIONS") {
			// Handle CORS preflight requests
			return new Response(null, { headers: corsHeaders })
		}

		if (request.method === "GET") {
			return new Response(JSON.stringify({ message: "It work" }), { headers: corsHeaders })
		}

		if (request.method === "POST") {
			const url = new URL(request.url)

			// Npy upload
			if (url.pathname === "/api/start-upload") {
				return handleVideoStartUpload(request, env)
			} else if (url.pathname === "/api/upload-part") {
				return handleVideoUploadChunk(request, env)
			} else if (url.pathname === "/api/complete-upload") {
				return handleVideoCompleteUpload(request, env)
			}
			return new Response("API not found", { status: 404, headers: corsHeaders })
		}

		return new Response("Not Found", { status: 404 })
	},
}
