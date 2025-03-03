"use server";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { revalidatePath } from "next/cache";
import { z } from "zod";

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

// Schema for image upload validation
const imageUploadSchema = z.object({
  fileName: z.string(),
  fileType: z.string().startsWith("image/"),
  fileBuffer: z.instanceof(ArrayBuffer),
  folder: z.string().default("editor-images"),
});

type ImageUploadInput = z.infer<typeof imageUploadSchema>;

/**
 * Server action to upload an image to S3
 */
export async function uploadImage(input: ImageUploadInput): Promise<{ success: boolean; url?: string; error?: string }> {
  // Check if S3 is properly configured
  if (!isS3Configured) {
    return {
      success: false,
      error: "S3 bucket is not configured. Please add S3_BUCKET, S3_ACCESS_KEY, and S3_SECRET_ACCESS_KEY to your environment variables.",
    };
  }

  try {
    // Validate input
    const validatedInput = imageUploadSchema.parse(input);
    
    // Create a unique filename with timestamp
    const timestamp = new Date().getTime();
    const fileExtension = validatedInput.fileName.split('.').pop();
    const fileName = `${validatedInput.folder}/${timestamp}-${validatedInput.fileName.split('.')[0]}.${fileExtension}`;
    
    // Convert ArrayBuffer to Uint8Array for S3 compatibility
    const fileData = new Uint8Array(validatedInput.fileBuffer);
    
    // Set up the upload parameters
    const params = {
      Bucket: S3_BUCKET as string,
      Key: fileName,
      Body: fileData,
      ContentType: validatedInput.fileType,
    };

    // Upload the file to S3
    await s3Client!.send(new PutObjectCommand(params));
    
    // Return the public URL
    const url = `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/${fileName}`;
    
    return { success: true, url };
  } catch (error) {
    console.error("Error uploading image:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred during upload" 
    };
  }
} 