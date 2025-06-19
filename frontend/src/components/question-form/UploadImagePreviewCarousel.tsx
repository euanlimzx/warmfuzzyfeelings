import UploadImagePreview from "./UploadImagePreview";

interface UploadImagePreviewCarousellProps {
  uploadedFiles: Array<File | null>;
  removeImageFromUploadList: (file: File) => void;
}

export default function UploadImagePreviewCarousel({
  uploadedFiles,
  removeImageFromUploadList,
}: UploadImagePreviewCarousellProps) {
  return (
    <>
      <p
        className={`text-sm font-medium text-gray-500 ${
          uploadedFiles?.length ? "" : "hidden"
        }`}
      >
        Here&apos;s a preview of how your image will appear on the card itself -
        do crop before uploading if it looks funny! (SORRY)
      </p>
      <div className="p-1"></div>
      <div className="flex flex-row overflow-x-scroll">
        {uploadedFiles.map((uploadedFile) => {
          if (!uploadedFile) {
            return;
          }
          const imageLocalUrl = URL.createObjectURL(uploadedFile);

          return (
            <UploadImagePreview
              uploadedImageUrl={imageLocalUrl}
              key={imageLocalUrl}
              removeImage={() => removeImageFromUploadList(uploadedFile)}
            />
          );
        })}
      </div>
    </>
  );
}
