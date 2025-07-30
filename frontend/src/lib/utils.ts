import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertImagesWebP = async (files: File[]): Promise<File[]> => {
  const convertedFiles = await Promise.all(
    files.map(async (file) => {
      // Create canvas and load image
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      // Convert to WebP using canvas
      return new Promise((resolve) => {
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(
                  new File([blob], file.name.replace(/\.[^/.]+$/, ".webp"), {
                    type: "image/webp",
                  })
                );
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
  return convertedFiles as File[];
};
