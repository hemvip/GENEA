import { S3Client } from "@aws-sdk/client-s3"
import { Upload } from "@aws-sdk/lib-storage"
import { corsHeaders } from "./cors.js"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ INIT MULTIPART UPLOAD ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export async function handleUpload(request, env) {
	const formData = await request.formData()
	const systemname = formData.get("systemname")
	const fileName = formData.get("fileName")
	const totalSize = formData.get("totalSize")
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
		const uniqueKey = `videos/original/${systemname}/${fileName}`

		const upload = new Upload({
			client: s3Client,
			params: {
				Bucket: env.R2_BUCKET_NAME,
				Key: uniqueKey,
				Body: file.stream(),
				ContentType: "video/mp4",
			},
			leavePartsOnError: false, // Optional: Ensure partial uploads are cleaned up on failure
		})

		// Perform the upload
		const rsupload = await upload.done()
		console.log("rsupload", rsupload)

		const inputcode = fileName.replace(/\.[^.]+$/, "")
		return new Response(
			JSON.stringify({
				success: true,
				path: uniqueKey,
				inputcode: inputcode,
				url: `https://e62de0d5e5e9873cf19207d31ed0c65e.r2.cloudflarestorage.com/${env.R2_BUCKET_NAME}/${uniqueKey}`,
				msg: "Your video upload are successfully.",
				error: null,
			}),
			{
				headers: { ...corsHeaders, "Content-Type": "application/json" },
			}
		)
	} catch (error) {
		console.log("error", error)
		return new Response(JSON.stringify({ success: false, msg: "Exception created upload.", error: error }), {
			status: 500,
			headers: { ...corsHeaders, "Content-Type": "application/json" },
		})
	}
}
