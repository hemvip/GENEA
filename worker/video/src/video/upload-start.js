import { S3Client, CreateMultipartUploadCommand } from "@aws-sdk/client-s3"
import { corsHeaders } from "../cors.js"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ INIT MULTIPART UPLOAD ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export async function handleStartUpload(request, env) {
	const formData = await request.formData()
	const systemname = formData.get("systemname")
	const fileName = formData.get("fileName")
	const totalSize = formData.get("totalSize")
	console.log("handleStartUpload.userId", systemname)

	if (!fileName) {
		return new Response(JSON.stringify({ msg: "File name not found", error: null, success: false }), {
			headers: { ...corsHeaders, "Content-Type": "application/json" },
		})
	}

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	const s3Client = new S3Client({
		endpoint: env.B2_ENDPOINT,
		region: env.B2_REGION,
		credentials: {
			accessKeyId: env.B2_KEYID,
			secretAccessKey: env.B2_APPLICATIONKEY,
		},
	})

	if (!s3Client) {
		return new Response(JSON.stringify({ success: false, msg: "Cannot connect to blackblaze storage.", error: null }), {
			headers: { ...corsHeaders, "Content-Type": "application/json" },
		})
	}

	const uniqueKey = `videos/original/${systemname}/${fileName}`
	console.log("Bucket: ", env.BUCKET_NAME)
	const command = new CreateMultipartUploadCommand({
		Bucket: env.BUCKET_NAME,
		Key: uniqueKey,
		ContentType: "application/mp4",
	})

	try {
		const { UploadId } = await s3Client.send(command)
		return new Response(JSON.stringify({ uploadId: UploadId, success: true, msg: "Created mutipart upload.", error: null }), {
			headers: { ...corsHeaders, "Content-Type": "application/json" },
		})
	} catch (error) {
		console.log("error", error)
		return new Response(JSON.stringify({ success: false, msg: "Exception created mutipart upload.", error: error }), {
			status: 500,
			headers: { ...corsHeaders, "Content-Type": "application/json" },
		})
	}
}
