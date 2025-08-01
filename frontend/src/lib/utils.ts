import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { heicTo, isHeic } from "heic-to";

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
  console.log('convertImagesWebP: Processing files:', files.map(f => ({ name: f.name, type: f.type })));
  
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
        return await convertToWebP(jpgFile);
      }

      // For non-HEIC files, convert directly to WebP
      return await convertToWebP(file);
    })
  );
  
  console.log('convertImagesWebP: Final processed files:', processedFiles.map(f => ({ name: f.name, type: f.type })));
  return processedFiles;
};
