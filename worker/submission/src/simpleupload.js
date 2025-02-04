import { S3Client } from "@aws-sdk/client-s3"
import { Upload } from "@aws-sdk/lib-storage"
import { corsHeaders } from "./cors.js"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ INIT MULTIPART UPLOAD ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export async function handleUpload(request, env) {
	const formData = await request.formData()
	const userId = formData.get("userId")
	const fileName = formData.get("fileName")
	const file = formData.get("file")

	if (!fileName) {
		return new Response(JSON.stringify({ msg: "File name not found", error: null, success: false }), {
			headers: { ...corsHeaders, "Content-Type": "application/json" },
		})
	}

	const s3Client = new S3Client({
		endpoint: env.R2_ENDPOINT,
		region: "auto",
		credentials: {
			accessKeyId: env.R2_ACCESS_KEY_ID,
			secretAccessKey: env.R2_SECRET_ACCESS_KEY,
		},
	})

	if (!s3Client) {
		return new Response(JSON.stringify({ success: false, msg: "Cannot connect to blackblaze storage.", error: null }), {
			headers: { ...corsHeaders, "Content-Type": "application/json" },
		})
	}

	try {
		const uniqueKey = `motions/${userId}/${fileName}`

		const upload = new Upload({
			client: s3Client,
			params: {
				Bucket: env.R2_BUCKET_NAME,
				Key: uniqueKey,
				Body: file.stream(),
			},
			leavePartsOnError: false, // Optional: Ensure partial uploads are cleaned up on failure
		})

		// Perform the upload
		await upload.done()

		// console.log("upload", upload)

		return new Response(JSON.stringify({ path: uniqueKey, success: true, msg: "Upload success", error: null }), {
			headers: { ...corsHeaders, "Content-Type": "application/json" },
		})
	} catch (error) {
		console.log("error", error)
		return new Response(JSON.stringify({ success: false, msg: "Exception created upload.", error: error }), {
			status: 500,
			headers: { ...corsHeaders, "Content-Type": "application/json" },
		})
	}
}
