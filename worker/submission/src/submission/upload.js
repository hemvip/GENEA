// @ts-ignore
import { S3Client, CreateBucketCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { ObjectId } from 'bson';

export async function handleUpload(client, request, env) {
	// try {

	// 	// Check if the validation is successful
	// 	if (result.success) {
	// const db2 = client.db('hemvip');
	// const result = await db2.collection('bvh').findOne({});
	// console.log('result', result);

	// 		if (result) {
	// 			delete result._id;
	// 			// console.log(result)
	// 			return {
	// 				errors: null,
	// 				success: true,
	// 				data: result,
	// 				msg: 'Success to start a study',
	// 			};
	// 		} else {
	// 			return {
	// 				errors: null,
	// 				success: true,
	// 				data: null,
	// 				msg: 'Studies not exist with prolificid, studyid, sessionid',
	// 			};
	// 		}
	// 	} else {
	// 		// If validation errors, map them into an object
	// 		let serverErrors = Object.fromEntries(result.error?.issues?.map((issue) => [issue.path[0], issue.message]) || []);
	// 		return {
	// 			errors: serverErrors,
	// 			success: false,
	// 			data: null,
	// 			msg: 'Failed to parse proflificid, studyid, sessionid',
	// 		};
	// 	}
	// } catch (error) {
	// 	return {
	// 		errors: error,
	// 		success: false,
	// 		data: null,
	// 		msg: 'Internal server error',
	// 	};
	// }

	const formData = await request.formData();
	const userId = formData.get('userId');
	const email = formData.get('email');
	const teamname = formData.get('teamname');

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	const s3 = new S3Client({
		endpoint: env.B2_ENDPOINT,
		region: env.B2_REGION,
		credentials: {
			accessKeyId: env.B2_KEYID,
			secretAccessKey: env.B2_APPLICATIONKEY,
		},
	});
	if (!s3) {
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

	try {
		for (let [key, value] of formData.entries()) {
			if (key === 'motion_files') {
				const arrayBuffer = await value.arrayBuffer();
				// const uniqueKey = `bvh/${userId}/${Date.now()}_${value.name}`
				const uniqueKey = `bvh/${userId}/${value.name}`;
				console.log('Uploading uniqueKey: ', uniqueKey);

				// Create the parameters for the PutObjectCommand
				const params = {
					Bucket: 'gesture',
					Key: uniqueKey,
					Body: new Uint8Array(arrayBuffer),
					ContentType: 'binary/octet-stream',
				};
				// Upload the video file to B2 storage
				const uploadResult = await s3.send(new PutObjectCommand(params));

				const filename = value.name.split('.');
				if (filename.length > 1) {
					filename.pop();
				}
				const inputid = filename.join('.');

				const insertResult = await db.collection('bvh').insertOne({
					_id: new ObjectId(),
					inputid: inputid,
					bvhid: uploadResult.ETag.replace(/\"/g, ''),
					teamid: userId,
					url: `https://gesture.s3.${env.B2_REGION}.backblazeb2.com/${uniqueKey}`,
				});
				console.log('insertResult', insertResult);

				if (insertResult.insertedId) {
					return {
						success: true,
						msg: 'Your submission are successfully.',
						error: null,
					};
				}

				return {
					success: false,
					msg: 'Upload success but failed insert submissions, please contact for support.',
					error: null,
				};
			}
		}
	} catch (error) {
		console.log('Exception: ', error);
		return {
			success: false,
			msg: 'Your submissions is failed, please contact for support.',
			error: error,
		};
	}
}
