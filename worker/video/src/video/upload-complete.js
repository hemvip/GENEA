import { S3Client, CompleteMultipartUploadCommand } from "@aws-sdk/client-s3"
import { ObjectId as MongoId } from "bson"
import { corsHeaders } from "../cors.js"
import * as Realm from "realm-web"

let App
const ObjectId = Realm.BSON.ObjectID

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ COMPLETE MULTIPART UPLOAD ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export async function handleCompleteUpload(request, env) {
	const formData = await request.formData()
	const systemname = formData.get("systemname")
	const fileName = formData.get("fileName")
	const parts = formData.get("parts")
	const uploadId = formData.get("uploadId")

	// console.log("handleCompleteUpload", "fileName", fileName, "uploadId", uploadId, "parts", parts)

	if (!parts) {
		return new Response(JSON.stringify({ msg: "File parts not found", error: null, success: false }), {
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
	const multipartUpload = JSON.parse(parts)
	console.log("Bucket: ", env.BUCKET_NAME)
	const command = new CompleteMultipartUploadCommand({
		Bucket: env.BUCKET_NAME,
		Key: uniqueKey,
		UploadId: uploadId,
		MultipartUpload: { Parts: multipartUpload },
	})

	try {
		const response = await s3Client.send(command)
		console.log("response", response)

		// App = App || new Realm.App(env.ATLAS_APPID)
		// const credentials = Realm.Credentials.apiKey(env.ATLAS_APP_API_KEY)

		// Attempt to authenticate
		// const user = await App.logIn(credentials)
		// const client = user.mongoClient("mongodb-atlas")

		// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		// const db = client.db("hemvip")
		// if (!db) {
		// 	return new Response(
		// 		JSON.stringify({
		// 			success: false,
		// 			msg: "Cannot connect to MongoDB storage.",
		// 			error: null,
		// 		}),
		// 		{ status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
		// 	)
		// }

		// const insertResult = await db.collection("videos").insertOne({
		// 	_id: new MongoId(),
		// 	inputid: fileName,
		// 	time: new Date(),
		// 	bvhid: response.Location,
		// 	teamid: systemname,
		// 	url: `https://genealeaderboard.s3.${env.B2_REGION}.backblazeb2.com/${uniqueKey}`,
		// })

		// if (insertResult.insertedId) {
		// 	return new Response(
		// 		JSON.stringify({
		// 			success: true,
		// 			msg: "Your submission are successfully.",
		// 			error: null,
		// 		}),
		// 		{
		// 			headers: { ...corsHeaders, "Content-Type": "application/json" },
		// 		}
		// 	)
		// } else {
		// 	return new Response(JSON.stringify({ success: false, msg: "Upload file successful but unable to update database.", error: null }), {
		// 		headers: { ...corsHeaders, "Content-Type": "application/json" },
		// 	})
		// }
		return new Response(
			JSON.stringify({
				success: true,
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
