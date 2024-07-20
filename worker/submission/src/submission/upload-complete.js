import { S3Client, CompleteMultipartUploadCommand } from '@aws-sdk/client-s3';
import { ObjectId } from 'bson';
import { corsHeaders } from '../cors.js';

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ COMPLETE MULTIPART UPLOAD ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export async function handleCompleteUpload(request, env) {
	const formData = await request.formData();
	const userId = formData.get('userId');
	const fileName = formData.get('fileName');
	const parts = formData.get('parts');
	const uploadId = formData.get('uploadId');

	if (!parts) {
		return new Response(JSON.stringify({ msg: 'File parts not found', error: null, success: false }), {
			headers: { ...corsHeaders, 'Content-Type': 'application/json' },
		});
	}

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	const s3Client = new S3Client({
		endpoint: env.B2_ENDPOINT,
		region: env.B2_REGION,
		credentials: {
			accessKeyId: env.B2_KEYID,
			secretAccessKey: env.B2_APPLICATIONKEY,
		},
	});

	if (!s3Client) {
		return new Response(JSON.stringify({ success: false, msg: 'Cannot connect to blackblaze storage.', error: null }), {
			headers: { ...corsHeaders, 'Content-Type': 'application/json' },
		});
	}

	const uniqueKey = `bvh/${userId}/${fileName}`;
	const command = new CompleteMultipartUploadCommand({
		Bucket: 'gesture',
		Key: uniqueKey,
		UploadId: uploadId,
		MultipartUpload: { Parts: parts },
	});

	try {
		const response = await s3Client.send(command);
		return new Response(JSON.stringify({ success: true, msg: 'Success complete upload.', error: null }), {
			headers: { ...corsHeaders, 'Content-Type': 'application/json' },
		});
	} catch (error) {
		return new Response(JSON.stringify({ success: false, msg: `Exception complete upload.`, error: error }), {
			status: 500,
			headers: { ...corsHeaders, 'Content-Type': 'application/json' },
		});
	}
}
