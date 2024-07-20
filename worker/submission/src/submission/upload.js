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
		ContentType: 'application/octet-stream',
	};

	const createResponse = await s3Client.send(new CreateMultipartUploadCommand(params));
	// console.log('createResponse', createResponse);
	return createResponse.UploadId;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ UPLOAD CHUNK ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
async function uploadChunk(s3Client, key, dataChunk, partNumber, uploadId) {
	const params = {
		Bucket: 'gesture',
		Key: key,
		Body: dataChunk, // data.slice(start, end),
		ContentType: 'binary/octet-stream',
		PartNumber: partNumber,
		UploadId: uploadId,
	};
	console.log('params', params);

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
	// console.log('completeResponse', completeResponse);
	return completeResponse;
}

async function multipartUpload(s3Client, key, data) {
	// initalize multipart upload
	const uploadId = await initMultipartUpload(s3Client, key);
	// console.log('uploadId', uploadId);

	// upload parts
	const chunkSize = 5 * 1024 * 1024; // 5MB
	const parts = [];
	let partNumber = 1;
	for (let start = 0; start < data.size; start += chunkSize) {
		const end = Math.min(start + chunkSize, data.size);
		const dataChunk = data.slice(start, end);
		const part = await uploadChunk(s3Client, key, dataChunk, partNumber, uploadId);
		parts.push(part);
		partNumber++;
	}

	// complete multipart upload
	const { Location, Key, ETag } = await completeMultipartUpload(s3Client, key, parts, uploadId);
	return { Location, Key, ETag };
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
		const motionFiles = formData.getAll('motion_files');
		if (motionFiles.length === 0) {
			return {
				success: false,
				msg: 'No motion files found.',
				error: null,
			};
		}

		for (let i = 0; i < motionFiles.length; i++) {
			const motionFile = motionFiles[i];

			// PATH: bvh/{userId}/{motionFile.name}
			const uniqueKey = `bvh/${userId}/${motionFile.name}`;
			console.log('Uploading uniqueKey: ', uniqueKey);

			const filename = motionFile.name.split('.');
			if (filename.length > 1) {
				filename.pop();
			}

			const uploadResult = await multipartUpload(s3Client, uniqueKey, motionFile);
			if (!uploadResult) {
				return {
					success: false,
					msg: 'Upload to blackblaze failed, please contact for support.',
					error: null,
				};
			}

			const { Location, Key } = uploadResult;
			const insertResult = await db.collection('bvh').insertOne({
				_id: ObjectId.createFromHexString(Key),
				inputid: filename.join('.'),
				time: new Date(),
				bvhid: Location, // uploadResult.ETag.replace(/\"/g, ''),
				teamid: userId,
				url: `https://gesture.s3.${env.B2_REGION}.backblazeb2.com/${uniqueKey}`,
			});

			if (insertResult.insertedId) {
				return {
					success: true,
					msg: 'Your submission are successfully.',
					error: null,
				};
			} else {
				return {
					success: true,
					msg: 'Upload file successful but unable to update database.',
					error: null,
				};
			}
		}

		return {
			success: true,
			msg: 'Your submission are successfully.',
			error: null,
		};

		// return {
		// 	success: false,
		// 	msg: 'Upload success but failed insert submissions, please contact for support.',
		// 	error: null,
		// };
	} catch (error) {
		console.log('Exception: ', error);
		return {
			success: false,
			msg: 'Your submissions is failed, please contact for support.',
			error: error,
		};
	}
}
