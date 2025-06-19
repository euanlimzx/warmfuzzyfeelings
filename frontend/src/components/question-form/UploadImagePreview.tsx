interface UploadImagePreviewProps {
  uploadedImageUrl: string | Blob | null;
}

export default function UploadImagePreview({
  uploadedImageUrl,
}: UploadImagePreviewProps) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div>
        <div className="relative h-60 w-60 sm:h-75 sm:w-75 my-2">
          <img
            alt="uploadedMainImage"
            id="uploaded-main-image-preview"
            className="w-full h-full object-cover border-2 border-black"
            src={uploadedImageUrl || undefined}
          />
        </div>
      </div>
    </div>
  );
}
