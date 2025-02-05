import { S3Client, CompleteMultipartUploadCommand } from "@aws-sdk/client-s3"
import { corsHeaders } from "../cors.js"
import * as Realm from "realm-web"
import { getClient } from "../s3client.js"

let App
const ObjectId = Realm.BSON.ObjectID

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ COMPLETE MULTIPART UPLOAD ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export async function handleCompleteUpload(request, env) {
	const formData = await request.formData()
	const systemname = formData.get("systemname")
	const fileName = formData.get("fileName")
	const parts = formData.get("parts")
	const uploadId = formData.get("uploadId")
	// console.log("handleCompleteUpload.formData", formData)

	// console.log("handleCompleteUpload", "fileName", fileName, "uploadId", uploadId, "parts", parts)

	if (!parts) {
		return new Response(JSON.stringify({ msg: "File parts not found", error: null, success: false }), {
			headers: { ...corsHeaders, "Content-Type": "application/json" },
		})
	}

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	const s3Client = getClient(env)

	if (!s3Client) {
		return new Response(JSON.stringify({ success: false, msg: "Cannot connect to blackblaze storage.", error: null }), {
			headers: { ...corsHeaders, "Content-Type": "application/json" },
		})
	}

	const uniqueKey = `videos/original/${systemname}/${fileName}`
	const multipartUpload = JSON.parse(parts)
	console.log("Bucket: ", env.R2_BUCKET_NAME)
	const command = new CompleteMultipartUploadCommand({
		Bucket: env.R2_BUCKET_NAME,
		Key: uniqueKey,
		UploadId: uploadId,
		MultipartUpload: { Parts: multipartUpload },
	})

	try {
		const response = await s3Client.send(command)
		const url = response.Location

		const inputcode = fileName.replace(/\.[^.]+$/, "")
		return new Response(
			JSON.stringify({
				success: true,
				path: uniqueKey,
				inputcode: inputcode,
				url: url,
				msg: "Your video upload are successfully.",
				error: null,
			}),
			{
				headers: { ...corsHeaders, "Content-Type": "application/json" },
			}
		)
	} catch (error) {
		console.error("error", error)
		return new Response(JSON.stringify({ success: false, msg: `Exception complete upload.`, error: JSON.stringify(error) }), {
			status: 500,
			headers: { ...corsHeaders, "Content-Type": "application/json" },
		})
	}
}
