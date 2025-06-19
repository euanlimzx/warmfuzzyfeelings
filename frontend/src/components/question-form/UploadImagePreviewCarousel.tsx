import ImageCarousel from "./Carousell";

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
      <div className="flex justify-center">
        <ImageCarousel
          uploadedFiles={uploadedFiles}
          removeImageFromUploadList={removeImageFromUploadList}
        />
      </div>
    </>
  );
}
