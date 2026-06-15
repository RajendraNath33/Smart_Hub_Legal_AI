import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const region = "auto";
const accountId = process.env.R2_ACCOUNT_ID;
const bucketName = process.env.R2_BUCKET_NAME;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

if (!accountId) {
  throw new Error("Missing R2_ACCOUNT_ID in environment variables.");
}

if (!bucketName) {
  throw new Error("Missing R2_BUCKET_NAME in environment variables.");
}

if (!accessKeyId || !secretAccessKey) {
  throw new Error("Missing R2_ACCESS_KEY_ID or R2_SECRET_ACCESS_KEY in environment variables.");
}

const endpoint = `https://${accountId}.r2.cloudflarestorage.com`;

export const r2Client = new S3Client({
  region,
  endpoint,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export const r2BucketName = bucketName;

export async function uploadToR2(key: string, body: ArrayBuffer | Uint8Array | Blob | string) {
  const value = body instanceof ArrayBuffer ? new Uint8Array(body) : body;
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: value,
  });
  return await r2Client.send(command);
}
