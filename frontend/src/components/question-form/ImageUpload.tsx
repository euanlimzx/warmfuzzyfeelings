"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { IoImagesSharp } from "react-icons/io5";
import UploadImagePreviewCarousel from "./UploadImagePreviewCarousel";
import { convertImagesWebP } from "@/lib/utils";
import BouncingDots from "../ui/BouncingDots";

interface ImageUploaderProps {
  imageFiles: Array<File | null>;
  setImageFiles: Dispatch<SetStateAction<Array<File | null>>>;
  isValid?: boolean;
  label?: string;
  removeImageFromUploadList: (file: File) => void;
}

export default function ImageUploader({
  imageFiles,
  setImageFiles,
  isValid = true,
  label,
  removeImageFromUploadList,
}: ImageUploaderProps) {
  const [isImageUploaderLoading, setIsImageUploaderLoading] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // TODO: Fix this later as well
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files.length) {
      const fileArray = Array.from(e.dataTransfer.files);
      setImageFiles(fileArray);
    }
  };

  const handleUploadButtonClick = () => {
    const fileUploadElement = document.getElementById("main-image-upload");
    if (!fileUploadElement) {
      return;
    }
    fileUploadElement.click();
  };

  const handleFileClickUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length) {
      const fileArray = Array.from(e.target.files);
      setIsImageUploaderLoading(true);
      // convert all the files to a webp format, to make them smaller
      const webpImages = await convertImagesWebP(fileArray);
      setIsImageUploaderLoading(false);
      setImageFiles(webpImages);
    }
  };

  return (
    <>
      {label && <label className="text-md font-medium">{label}</label>}

      <div
        className={`${
          imageFiles?.length && !isImageUploaderLoading ? "" : "hidden"
        }`}
      >
        <UploadImagePreviewCarousel
          uploadedFiles={imageFiles!}
          removeImageFromUploadList={removeImageFromUploadList}
        />
      </div>

      <div
        className={`${
          imageFiles?.length ? "hidden" : ""
        } hover:cursor-pointer bg-yellow-200 flex flex-col items-center justify-center border-2 border-black h-[200px] px-10 w-full ${
          !isValid ? "ring-2 ring-red-500" : ""
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleUploadButtonClick}
      >
        <div className="flex flex-col items-center justify-center gap-4">
          {isImageUploaderLoading ? (
            <BouncingDots className="mt-0 space-x-4" />
          ) : (
            <>
              <IoImagesSharp size={46} color="black" />
              {!imageFiles?.length && (
                <div className="text-center font-medium">
                  Click to select from your files or drag and drop an image
                  here!
                </div>
              )}
            </>
          )}

          <input
            type="file"
            name="mainImageUpload"
            accept=".jpg, .jpeg, .png, .webp, .heic"
            id="main-image-upload"
            className="hidden"
            onChange={handleFileClickUpload}
            multiple
          />
        </div>
      </div>
    </>
  );
}
