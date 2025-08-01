import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper function to convert HEIC to JPG
const convertHeicToJpg = async (file: File): Promise<File | null> => {
  // Check if the file is HEIC
  if (file.type === 'image/heic' || file.type === 'image/heif' || file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif')) {
    try {
      console.log(`[HEIC CONVERSION] Original HEIC file: ${file.name}, Size: ${(file.size / 1024 / 1024).toFixed(2)}MB, Type: ${file.type}`);
      
      // Dynamically import heic2any only on the client side
      const heic2any = (await import('heic2any')).default;
      
      // Convert HEIC to JPG
      const jpgBlob = await heic2any({
        blob: file,
        toType: 'image/jpeg',
        quality: 0.9
      });
      
      const jpgFile = new File([jpgBlob as Blob], file.name.replace(/\.(heic|heif)$/i, '.jpg'), { type: 'image/jpeg' });
      console.log(`[HEIC CONVERSION] HEIC → JPG: ${jpgFile.name}, Size: ${(jpgFile.size / 1024 / 1024).toFixed(2)}MB, Type: ${jpgFile.type}`);
      console.log(`[HEIC CONVERSION] Size change: ${((jpgFile.size - file.size) / 1024 / 1024).toFixed(2)}MB (${((jpgFile.size / file.size - 1) * 100).toFixed(1)}%)`);
      
      return jpgFile;
    } catch (error) {
      console.error(`[HEIC CONVERSION] Error converting HEIC file:`, error);
      throw new Error(`Failed to convert HEIC file: ${error}`);
    }
  }
  return null; // Not a HEIC file, return null to process normally
};

// Helper function to convert any image to WebP using canvas
const convertToWebP = async (file: File): Promise<File> => {
  console.log(`[WEBP CONVERSION] Original file: ${file.name}, Size: ${(file.size / 1024 / 1024).toFixed(2)}MB, Type: ${file.type}`);
  
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
            const convertedFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".webp"), {
              type: "image/webp",
            });
            
            console.log(`[WEBP CONVERSION] Converted file: ${convertedFile.name}, Size: ${(convertedFile.size / 1024 / 1024).toFixed(2)}MB, Type: ${convertedFile.type}`);
            console.log(`[WEBP CONVERSION] Size change: ${((convertedFile.size - file.size) / 1024 / 1024).toFixed(2)}MB (${((convertedFile.size / file.size - 1) * 100).toFixed(1)}%)`);
            
            resolve(convertedFile);
          } else {
            reject(new Error('Failed to convert image to WebP'));
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
      // First try to convert HEIC to JPG
      const jpgFile = await convertHeicToJpg(file);
      if (jpgFile) {
        // HEIC was converted to JPG, now convert JPG to WebP
        console.log(`[HEIC CONVERSION] Converting JPG to WebP...`);
        return await convertToWebP(jpgFile);
      }
      
      // For non-HEIC files, convert directly to WebP
      return await convertToWebP(file);
    })
  );
  return convertedFiles as File[];
};
