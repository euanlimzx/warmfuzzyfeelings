import { useState, useEffect } from "react";

interface UploadImagePreviewProps {
  uploadedImageUrl: string | Blob | null;
  uploadedFile?: File | null;
}

export default function UploadImagePreview({
  uploadedImageUrl,
  uploadedFile,
}: UploadImagePreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const createPreview = async () => {
      console.log('UploadImagePreview: createPreview called');
      console.log('UploadImagePreview: uploadedFile:', uploadedFile);
      console.log('UploadImagePreview: uploadedImageUrl:', uploadedImageUrl);
      
      if (!uploadedFile) {
        console.log('UploadImagePreview: No uploadedFile, using uploadedImageUrl');
        setPreviewUrl(uploadedImageUrl as string);
        return;
      }

      // Check if it's a HEIF file
      const extension = uploadedFile.name.toLowerCase().split('.').pop();
      console.log('UploadImagePreview: File extension:', extension);
      console.log('UploadImagePreview: File name:', uploadedFile.name);
      console.log('UploadImagePreview: File type:', uploadedFile.type);
      
      if (extension === 'heif' || extension === 'heic') {
        console.log('UploadImagePreview: Detected HEIF/HEIC file, attempting conversion');
        
        // For HEIC files, we'll try to show a placeholder since browsers can't natively display them
        // The actual file will still be uploaded as HEIC
        try {
          // Create a simple placeholder or try to use the original URL
          console.log('UploadImagePreview: HEIC file detected - showing placeholder');
          
          // Create a canvas with a placeholder message
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = 300;
          canvas.height = 300;
          
          if (ctx) {
            // Fill with a light gray background
            ctx.fillStyle = "#f0f0f0";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Add text
            ctx.fillStyle = "#666";
            ctx.font = "16px Arial";
            ctx.textAlign = "center";
            ctx.fillText("HEIC Image", canvas.width / 2, canvas.height / 2 - 10);
            ctx.fillText("(Preview not available)", canvas.width / 2, canvas.height / 2 + 10);
            ctx.fillText("File will still be uploaded", canvas.width / 2, canvas.height / 2 + 30);
          }
          
          canvas.toBlob((blob) => {
            if (blob) {
              const placeholderUrl = URL.createObjectURL(blob);
              console.log('UploadImagePreview: Created HEIC placeholder:', placeholderUrl);
              setPreviewUrl(placeholderUrl);
            }
          }, "image/png");
          
        } catch (error) {
          console.error('UploadImagePreview: Error creating HEIC placeholder:', error);
          // Fallback to a simple text placeholder
          setPreviewUrl(uploadedImageUrl as string);
        }
      } else {
        // For non-HEIF files, use the original URL
        console.log('UploadImagePreview: Non-HEIF file, using original URL');
        setPreviewUrl(uploadedImageUrl as string);
      }
    };

    createPreview();
  }, [uploadedImageUrl, uploadedFile]);

  return (
    <div className="flex flex-col items-center justify-center">
      <div>
        <div className="relative h-60 w-60 sm:h-75 sm:w-75 my-2">
          <img
            alt="uploadedMainImage"
            id="uploaded-main-image-preview"
            className="w-full h-full object-cover border-2 border-black"
            src={previewUrl || undefined}
          />
        </div>
      </div>
    </div>
  );
}
