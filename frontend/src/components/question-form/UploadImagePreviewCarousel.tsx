import UploadImagePreview from "./UploadImagePreview";

interface UploadImagePreviewCarousellProps {
  uploadedFiles: Array<File | null>;
}

export default function UploadImagePreviewCarousel({
  uploadedFiles,
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
      <div className="overflow-x-scroll">
        hi there
        <UploadImagePreview />
        <UploadImagePreview />
        <UploadImagePreview />
        <UploadImagePreview />
      </div>
    </>
  );
}
