import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { heicTo, isHeic } from "heic-to";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper function to convert any image to WebP using canvas
export const convertToWebP = async (file: File): Promise<File> => {
  console.log(
    `[WEBP CONVERSION] Original file: ${file.name}, Size: ${(
      file.size /
      1024 /
      1024
    ).toFixed(2)}MB, Type: ${file.type}`
  );

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const img = new Image();

  return new Promise((resolve, reject) => {
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const convertedFile = new File(
              [blob],
              file.name.replace(/\.[^/.]+$/, ".webp"),
              {
                type: "image/webp",
              }
            );

            console.log(
              `[WEBP CONVERSION] Converted file: ${
                convertedFile.name
              }, Size: ${(convertedFile.size / 1024 / 1024).toFixed(
                2
              )}MB, Type: ${convertedFile.type}`
            );
            console.log(
              `[WEBP CONVERSION] Size change: ${(
                (convertedFile.size - file.size) /
                1024 /
                1024
              ).toFixed(2)}MB (${(
                (convertedFile.size / file.size - 1) *
                100
              ).toFixed(1)}%)`
            );

            resolve(convertedFile);
          } else {
            reject(new Error("Failed to convert image to WebP"));
          }
        },
        "image/webp",
        0.8 // convert to webp at 80% quality
      );
    };
    img.onerror = () => {
      reject(new Error(`Failed to load image: ${file.name}`));
    };
    img.src = URL.createObjectURL(file);
  });
};

export const convertImagesWebP = async (files: File[]): Promise<File[]> => {
  console.log(
    "convertImagesWebP: Processing files:",
    files.map((f) => ({ name: f.name, type: f.type }))
  );

  const processedFiles = await Promise.all(
    files.map(async (file) => {
      if (await isHeic(file)) {
        // HEIC was converted to JPG, now convert JPG to WebP
        console.log(`[HEIC CONVERSION] Converting JPG to WebP...`);
        const jpgBlob = await heicTo({
          blob: file,
          type: "image/jpeg",
          quality: 0.8,
        });
        const originalName = file.name.replace(/\.heic$/i, "");
        const jpgFile = new File([jpgBlob], `${originalName}.jpg`, {
          type: jpgBlob.type,
          lastModified: new Date().getTime(),
        });
        // return await convertToWebP(jpgFile);
        return jpgFile;
      }

      // For non-HEIC files, convert directly to WebP
      // return await convertToWebP(file);
      return file;
    })
  );

  console.log(
    "convertImagesWebP: Final processed files:",
    processedFiles.map((f) => ({ name: f.name, type: f.type }))
  );
  return processedFiles;
};

// New function to convert HEIC image URL to WebP blob
export const convertHeicUrlToWebP = async (imageUrl: string): Promise<string> => {
  try {
    console.log(`[HEIC DEBUG] Starting conversion for URL: ${imageUrl}`);
    
    // Fetch the HEIC image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }
    
    const blob = await response.blob();
    console.log(`[HEIC DEBUG] Fetched blob, size: ${blob.size} bytes, type: ${blob.type}`);
    
    // Check if it's actually a HEIC file
    // Create a temporary file from the blob for isHeic check
    const tempFile = new File([blob], 'temp.heic', { type: 'image/heic' });
    const isHeicFile = await isHeic(tempFile);
    console.log(`[HEIC DEBUG] isHeic check result: ${isHeicFile}`);
    
    if (isHeicFile) {
      console.log(`[HEIC DEBUG] Converting HEIC to JPEG...`);
      // Convert HEIC to JPEG first
      const jpegBlob = await heicTo({
        blob: blob,
        type: "image/jpeg",
        quality: 0.8,
      });
      console.log(`[HEIC DEBUG] HEIC to JPEG conversion successful, size: ${jpegBlob.size} bytes`);
      
      // Convert JPEG to WebP using canvas
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      
      return new Promise((resolve, reject) => {
        img.onload = () => {
          console.log(`[HEIC DEBUG] JPEG image loaded, dimensions: ${img.width}x${img.height}`);
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);
          canvas.toBlob(
            (webpBlob) => {
              if (webpBlob) {
                const webpUrl = URL.createObjectURL(webpBlob);
                console.log(`[HEIC DEBUG] WebP conversion successful, size: ${webpBlob.size} bytes, URL: ${webpUrl}`);
                resolve(webpUrl);
              } else {
                console.error(`[HEIC DEBUG] Failed to convert JPEG to WebP blob`);
                reject(new Error("Failed to convert JPEG to WebP"));
              }
            },
            "image/webp",
            0.8
          );
        };
        img.onerror = (error) => {
          console.error(`[HEIC DEBUG] Failed to load JPEG image for WebP conversion:`, error);
          reject(new Error("Failed to load JPEG image for WebP conversion"));
        };
        img.src = URL.createObjectURL(jpegBlob);
      });
    } else {
      console.log(`[HEIC DEBUG] Not a HEIC file, returning original URL`);
      // Not a HEIC file, return original URL
      return imageUrl;
    }
  } catch (error) {
    console.error(`[HEIC DEBUG] Error in convertHeicUrlToWebP:`, error);
    console.error(`[HEIC DEBUG] Error stack:`, error instanceof Error ? error.stack : 'No stack trace');
    // Return original URL if conversion fails
    return imageUrl;
  }
};
