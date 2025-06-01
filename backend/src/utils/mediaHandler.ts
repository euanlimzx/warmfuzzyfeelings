import { S3Client, S3ClientConfig, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { configDotenv } from "dotenv";

configDotenv();

const maxFileSize = 1024 * 1024 * 10;
const acceptedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

const s3ClientConfig: S3ClientConfig = {
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_IAM_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_IAM_SECRET_KEY!,
  },
};
export const s3Client = new S3Client(s3ClientConfig);

export const getAWSSignedUrl = async (
  imageName: string,
  fileSize: number,
  fileType: string,
) => {
  if (!imageName) {
    return { ok: false, message: "Invalid image name provided" };
  }

  if (fileSize > maxFileSize) {
    return { ok: false, fileValidationError: true, message: "File too large" };
  }

  if (!acceptedTypes.includes(fileType)) {
    return {
      ok: false,
      fileValidationError: true,
      message: "Invalid input type",
    };
  }

  try {
    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: imageName,
      ContentType: fileType,
      ContentLength: fileSize,
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
