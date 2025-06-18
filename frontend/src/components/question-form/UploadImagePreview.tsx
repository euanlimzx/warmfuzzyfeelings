import { FaTrashCan } from "react-icons/fa6";

interface UploadImagePreviewProps {
  uploadedImageUrl: string | Blob | null;
  clearUpload: () => void;
}

export default function UploadImagePreview({
  uploadedImageUrl,
  clearUpload,
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
        <div className="flex w-full justify-end py-2">
          <button
            className="cursor-pointer border-2 border-black bg-red-500 p-2 hover:bg-red-600 shadow-l transition-all shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]"
            onClick={clearUpload}
          >
            <div className="flex flex-row gap-2 items-center text-white font-medium">
              <FaTrashCan color="#ffffff" strokeWidth={1.25} />
              Delete
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
