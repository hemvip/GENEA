import { corsHeaders } from "./cors"
import { handleStartUpload } from "./video/upload-start"
import { handleUploadChunk } from "./video/upload-chunk"
import { handleCompleteUpload } from "./video/upload-complete"
import { handleUpload } from "./simpleupload"
import { handleR2Upload } from "./r2upload"

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

			if (url.pathname === "/upload") {
				return handleR2Upload(request, env)
			}

			// Npy upload
			if (url.pathname === "/api/start-upload") {
				return handleStartUpload(request, env)
			} else if (url.pathname === "/api/upload-part") {
				return handleUploadChunk(request, env)
			} else if (url.pathname === "/api/complete-upload") {
				return handleCompleteUpload(request, env)
			}
			return new Response("API not found", { status: 404, headers: corsHeaders })
		}

		return new Response("Not Found", { status: 404 })
	},
}
