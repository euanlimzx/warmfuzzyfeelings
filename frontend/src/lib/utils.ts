import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import convert from "heic-convert";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper function to convert any image to WebP using canvas
const convertToWebP = async (file: File): Promise<File> => {
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
  const convertedFiles = await Promise.all(
    files.map(async (file) => {
      if (file.type === "image/heic") {
        // HEIC was converted to JPG, now convert JPG to WebP
        console.log(`[HEIC CONVERSION] Converting JPG to WebP...`);
        const jpgFile = await convertHeicToFile(file);
        return await convertToWebP(jpgFile);
      }

      // For non-HEIC files, convert directly to WebP
      return await convertToWebP(file);
    })
  );
  return convertedFiles as File[];
};

async function convertHeicToFile(heicFile: File, quality = 1) {
  try {
    // Read the HEIC file as ArrayBuffer
    const arrayBuffer = await heicFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Convert HEIC to the desired format
    const outputBuffer = await convert({
      // @ts-expect-error they give a type error, but this works fine
      buffer: buffer,
      format: "JPEG",
      quality: quality,
    });

    // Create a Blob from the converted buffer
    const mimeType = "image/jpeg";
    const blob = new Blob([outputBuffer], { type: mimeType });

    // Create a File object from the Blob
    const originalName = heicFile.name.replace(/\.heic$/i, "");
    const extension = ".jpg";
    const fileName = `${originalName}${extension}`;

    const convertedFile = new File([blob], fileName, {
      type: mimeType,
      lastModified: Date.now(),
    });

    return convertedFile;
  } catch (error) {
    console.error("Error converting HEIC file:", error);
    throw new Error(`Failed to convert HEIC file: ${JSON.stringify(error)}`);
  }
}
