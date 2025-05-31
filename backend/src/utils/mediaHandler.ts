import { S3Client, S3ClientConfig, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { configDotenv } from "dotenv";

configDotenv();

const s3ClientConfig: S3ClientConfig = {
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_IAM_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_IAM_SECRET_KEY!,
  },
};
export const s3Client = new S3Client(s3ClientConfig);

export const getAWSSignedUrl = async (imageName: string = "lmaooo") => {
  try {
    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: imageName,
    });

    //@ts-ignore
    const signedUrl = await getSignedUrl(s3Client, putObjectCommand, {
      expiresIn: 60,
    });

    return { ok: true, url: signedUrl };
  } catch (err: any) {
    const errorMessage = "Error when trying to generate signed url";
    console.error(errorMessage, err);
    return { ok: false, message: errorMessage };
  }
};
