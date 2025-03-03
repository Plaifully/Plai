import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// S3 Configuration
const S3_BUCKET = process.env.S3_BUCKET;
const S3_REGION = process.env.S3_REGION || "us-east-2";
const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY;
const S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY;

// Check if all required S3 environment variables are set
const isS3Configured = !!(S3_BUCKET && S3_ACCESS_KEY && S3_SECRET_ACCESS_KEY);

// Initialize S3 client if environment variables are available
const s3Client = isS3Configured
  ? new S3Client({
      region: S3_REGION,
      credentials: {
        accessKeyId: S3_ACCESS_KEY as string,
        secretAccessKey: S3_SECRET_ACCESS_KEY as string,
      },
    })
  : null;

/**
 * Uploads a file to S3 and returns the URL
 * @param file The file to upload
 * @param folder Optional folder path within the bucket
 * @returns The URL of the uploaded file
 */
export async function uploadToS3(
  file: File, 
  folder: string = "uploads"
): Promise<string> {
  // Check if S3 is properly configured
  if (!isS3Configured) {
    throw new Error("S3 bucket is not configured. Please add S3_BUCKET, S3_ACCESS_KEY, and S3_SECRET_ACCESS_KEY to your environment variables.");
  }

  // Create a unique filename with timestamp
  const timestamp = new Date().getTime();
  const fileExtension = file.name.split('.').pop();
  const fileName = `${folder}/${timestamp}-${file.name.split('.')[0]}.${fileExtension}`;
  
  // Convert file to Uint8Array for S3 compatibility
  const fileBuffer = await file.arrayBuffer();
  const fileData = new Uint8Array(fileBuffer);
  
  // Set up the upload parameters
  const params = {
    Bucket: S3_BUCKET as string,
    Key: fileName,
    Body: fileData,
    ContentType: file.type,
  };

  try {
    // Upload the file to S3
    await s3Client!.send(new PutObjectCommand(params));
    
    // Return the public URL
    return `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/${fileName}`;
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw error;
  }
} 