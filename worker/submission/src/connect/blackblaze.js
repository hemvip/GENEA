import { S3Client } from '@aws-sdk/client-s3';

export function getBlackblazeClient(env) {
	return new S3Client({
		endpoint: env.B2_ENDPOINT,
		region: env.B2_REGION,
		credentials: {
			accessKeyId: env.B2_KEYID,
			secretAccessKey: env.B2_APPLICATIONKEY,
		},
	});
}
