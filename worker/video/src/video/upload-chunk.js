import { S3Client, UploadPartCommand } from "@aws-sdk/client-s3"
import { corsHeaders } from "../cors.js"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ UPLOAD CHUNK ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export async function handleUploadChunk(request, env) {
	const formData = await request.formData()
	const systemname = formData.get("systemname")
	const file = formData.get("file")
	const fileStream = file.stream()
	const partNumber = parseInt(formData.get("partNumber"))
	const uploadId = formData.get("uploadId")
	const fileName = formData.get("fileName")
	const totalSize = formData.get("totalSize")
	const chunkSize = formData.get("chunkSize")

	const reader = fileStream.getReader()
	const chunks = []

	// Read the file in chunks
	while (true) {
		const { done, value } = await reader.read()
		if (done) break
		chunks.push(value)
	}

	const fileBytes = new Uint8Array(chunks.flat())

	console.log("totalSize", totalSize, "chunkSize", chunkSize)

	if (!fileStream) {
		return new Response(JSON.stringify({ msg: "File not found", error: null, success: false }), {
			headers: { ...corsHeaders, "Content-Type": "application/json" },
		})
	}

	const removeHeaderMiddleware = (next) => async (args) => {
		// Remove the header from the request
		if (args.request.headers["x-amz-meta-custom-header"]) {
			delete args.request.headers["x-amz-meta-custom-header"]
		}
		if (args.request.headers["x-amz-checksum-crc32"]) {
			delete args.request.headers["x-amz-checksum-crc32"]
		}
		return next(args)
	}
	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	const s3Client = new S3Client({
		endpoint: env.B2_ENDPOINT,
		region: env.B2_REGION,
		credentials: {
			accessKeyId: env.B2_KEYID,
			secretAccessKey: env.B2_APPLICATIONKEY,
		},
		useArnRegion: false,
		requestChecksumCalculation: "WHEN_REQUIRED",
		forcePathStyle: true,
	})

	s3Client.middlewareStack.add(removeHeaderMiddleware, {
		step: "build",
		name: "removeHeaderMiddleware",
	})

	if (!s3Client) {
		return new Response(JSON.stringify({ success: false, msg: "Cannot connect to blackblaze storage.", error: null }), {
			headers: { ...corsHeaders, "Content-Type": "application/json" },
		})
	}

	const uniqueKey = `videos/original/${systemname}/${fileName}`
	console.log("Bucket: ", env.BUCKET_NAME)

	const command = new UploadPartCommand({
		Bucket: env.BUCKET_NAME,
		Key: uniqueKey,
		Body: fileBytes,
		PartNumber: partNumber,
		UploadId: uploadId,
	})

	// const urlSigned = await generateSignedUrl(s3Client, command)
	// console.log("urlSigned", urlSigned)

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
