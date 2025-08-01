import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertImagesWebP = async (files: File[]): Promise<File[]> => {
  console.log('convertImagesWebP: Processing files:', files.map(f => ({ name: f.name, type: f.type })));
  
  const processedFiles = await Promise.all(
    files.map(async (file) => {
      const extension = file.name.toLowerCase().split('.').pop();
      console.log('convertImagesWebP: Processing file:', file.name, 'extension:', extension);
      
      // If it's a HEIC/HEIF file, return it as-is (no conversion)
      if (extension === 'heic' || extension === 'heif') {
        console.log('convertImagesWebP: HEIC/HEIF file detected, keeping as-is:', file.name);
        return file;
      }

      // For all other files, convert to WebP
      console.log('convertImagesWebP: Converting to WebP:', file.name);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      return new Promise<File>((resolve) => {
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const webpFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".webp"), {
                  type: "image/webp",
                });
                console.log('convertImagesWebP: Created WebP file:', webpFile.name);
                resolve(webpFile);
              }
            },
            "image/webp",
            0.8 // convert to webp at 80% quality
          );
        };
        img.src = URL.createObjectURL(file);
      });
    })
  );
  
  console.log('convertImagesWebP: Final processed files:', processedFiles.map(f => ({ name: f.name, type: f.type })));
  return processedFiles;
};
