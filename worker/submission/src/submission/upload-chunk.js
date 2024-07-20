import { S3Client, UploadPartCommand } from "@aws-sdk/client-s3"
import { corsHeaders } from "../cors.js"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ UPLOAD CHUNK ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export async function handleUploadChunk(request, env) {
	const formData = await request.formData()
	const userId = formData.get("userId")
	const file = formData.get("file")
	const partNumber = parseInt(formData.get("partNumber"))
	const uploadId = formData.get("uploadId")
	const fileName = formData.get("fileName")

	// console.log("handleUploadChunk", "fileName", fileName, "uploadId", uploadId)

	if (!file) {
		return new Response(JSON.stringify({ msg: "File not found", error: null, success: false }), {
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

	const uniqueKey = `bvh/${userId}/${fileName}`
	const command = new UploadPartCommand({
		Bucket: "gesture",
		Key: uniqueKey,
		Body: file.stream(),
		PartNumber: partNumber,
		UploadId: uploadId,
	})

	try {
		const { ETag } = await s3Client.send(command)
		return new Response(JSON.stringify({ ETag: ETag, success: true, msg: "Success mutipart upload.", error: null }), {
			headers: { ...corsHeaders, "Content-Type": "application/json" },
		})
	} catch (error) {
		console.log("error", error)
		return new Response(JSON.stringify({ success: false, msg: `Exception chunk upload ${partNumber}-${uploadId}.`, error: error }), {
			status: 500,
			headers: { ...corsHeaders, "Content-Type": "application/json" },
		})
	}
}
