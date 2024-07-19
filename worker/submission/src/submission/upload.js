import { S3Client, CreateBucketCommand, PutObjectCommand } from '@aws-sdk/client-s3';

export async function handleUpload(client, request, env) {
	// try {

	// 	// Check if the validation is successful
	// 	if (result.success) {
	// 		const filter = {
	// 			status: 'started',
	// 			prolific_userid: prolificid,
	// 			prolific_studyid: studyid,
	// 			prolific_sessionid: sessionid,
	// 		};
	// 		const db = client.db('hemvip');

	// 		const result = await db.collection('studies').findOne(filter);

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

	const bvhfiles = [];

	return {
		errors: null,
		success: true,
		msg: 'Success to start a study',
	};
}
