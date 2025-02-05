import { S3Client } from "@aws-sdk/client-s3"

export function getClient(env) {
	const s3Client = new S3Client({
		endpoint: env.R2_ENDPOINT,
		region: "auto",
		credentials: {
			accessKeyId: env.R2_ACCESS_KEY_ID,
			secretAccessKey: env.R2_SECRET_ACCESS_KEY,
		},
	})

	return s3Client
}
