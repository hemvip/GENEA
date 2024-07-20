// @ts-ignore
import {
	S3Client,
	CreateBucketCommand,
	PutObjectCommand,
	CreateMultipartUploadCommand,
	UploadPartCommand,
	CompleteMultipartUploadCommand,
} from '@aws-sdk/client-s3';
import { ObjectId } from 'bson';

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ INIT MULTIPART UPLOAD ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
async function initMultipartUpload(s3Client, key) {
	const params = {
		Bucket: 'gesture',
		Key: key,
		ContentType: 'binary/octet-stream',
	};

	const createResponse = await s3Client.send(new CreateMultipartUploadCommand(params));
	console.log('createResponse', createResponse);
	return createResponse.UploadId;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ UPLOAD CHUNK ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
async function uploadChunk(s3Client, key, dataChunk, start, end, partNumber, uploadId) {
	const params = {
		Bucket: 'gesture',
		Key: key,
		Body: dataChunk, // data.slice(start, end),
		ContentType: 'binary/octet-stream',
		PartNumber: partNumber,
		UploadId: uploadId,
	};

	const uploadPartResponse = await s3Client.send(new UploadPartCommand(params));
	console.log('uploadPartResponse', uploadPartResponse);
	return { ETag: uploadPartResponse.ETag, PartNumber: partNumber };
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ COMPLETE MULTIPART UPLOAD ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
async function completeMultipartUpload(s3Client, key, parts, uploadId) {
	const params = {
		Bucket: 'gesture',
		Key: key,
		ContentType: 'binary/octet-stream',
		UploadId: uploadId,
		MultipartUpload: {
			Parts: parts,
		},
	};

	const completeResponse = await s3Client.send(new CompleteMultipartUploadCommand(params));
	console.log('completeResponse', completeResponse);
}

async function multipartUpload(s3Client, key, data) {
	// initalize multipart upload
	const uploadId = await initMultipartUpload(s3Client, key);
	console.log('uploadId', uploadId);

	// upload parts
	const chunkSize = 5 * 1024 * 1024; // 5MB
	const parts = [];
	let partNumber = 1;
	for (let start = 0; start < data.size; start += chunkSize) {
		const end = Math.min(start + chunkSize, data.size);
		const dataChunk = data.slice(start, end);
		const part = await uploadChunk(s3Client, key, dataChunk, start, end, partNumber, uploadId);
		parts.push(part);
		partNumber++;
	}

	// complete multipart upload
	await completeMultipartUpload(s3Client, key, parts, uploadId);

	return true;
}

export async function handleUpload(client, request, env) {
	const formData = await request.formData();
	const userId = formData.get('userId');
	// console.log('motion_files', formData.get('motion_files'));

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
		return {
			success: false,
			msg: 'Cannot connect to blackblaze storage.',
			error: null,
		};
	}

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	const db = client.db('hemvip');
	if (!db) {
		return {
			success: false,
			msg: 'Cannot connect to MongoDB storage.',
			error: null,
		};
	}

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	try {
		for (let [key, value] of formData.entries()) {
			if (key === 'motion_files') {
				const arrayBuffer = await value.arrayBuffer();
				// const uniqueKey = `bvh/${userId}/${Date.now()}_${value.name}`
				const uniqueKey = `bvh/${userId}/${value.name}`;
				console.log('Uploading uniqueKey: ', uniqueKey);

				// // Create the parameters for the PutObjectCommand
				// const params = {
				// 	Bucket: 'gesture',
				// 	Key: uniqueKey,
				// 	Body: new Uint8Array(arrayBuffer),
				// 	ContentType: 'binary/octet-stream',
				// };

				// // Upload the video file to B2 storage
				// const uploadResult = await s3.send(new PutObjectCommand(params));
				const uploadResult = multipartUpload(s3Client, uniqueKey, new Uint8Array(arrayBuffer));
				if (!uploadResult) {
					return {
						success: false,
						msg: 'Upload failed, please contact for support.',
						error: null,
					};
				}

				const filename = value.name.split('.');
				if (filename.length > 1) {
					filename.pop();
				}
				const inputid = filename.join('.');

				const insertResult = await db.collection('bvh').insertOne({
					_id: new ObjectId(),
					inputid: inputid,
					time: new Date(),
					bvhid: uniqueKey, // uploadResult.ETag.replace(/\"/g, ''),
					teamid: userId,
					url: `https://gesture.s3.${env.B2_REGION}.backblazeb2.com/${uniqueKey}`,
				});

				// console.log('insertResult', insertResult);

				if (insertResult.insertedId) {
					return {
						success: true,
						msg: 'Your submission are successfully.',
						error: null,
					};
				}

				return {
					success: false,
					msg: 'Motion file is not inform data, please contact for support.',
					error: null,
				};
			}
		}

		return {
			success: false,
			msg: 'Upload success but failed insert submissions, please contact for support.',
			error: null,
		};
	} catch (error) {
		console.log('Exception: ', error);
		return {
			success: false,
			msg: 'Your submissions is failed, please contact for support.',
			error: error,
		};
	}
}
