"use client";

import { useEffect, Dispatch, SetStateAction } from "react";
import { IoImagesSharp } from "react-icons/io5";
import UploadImagePreviewCarousel from "./UploadImagePreviewCarousel";

interface ImageUploaderProps {
  imageFiles: Array<File | null>;
  setImageFiles: Dispatch<SetStateAction<Array<File | null>>>;
  isValid?: boolean;
  label?: string;
}

export default function ImageUploader({
  imageFiles,
  setImageFiles,
  isValid = true,
  label,
}: ImageUploaderProps) {
  // food for thought: how should the pasting interaction look like?
  // should it be that any paste would upload an image, or should it be that you
  // have to be focussed on the field first, and copy and pasting after that would
  // upload the copied image

  const displayUploadedImage = (image: File) => {
    const imageDisplayField = document.getElementById(
      "uploaded-main-image-preview"
    );

    if (!imageDisplayField) {
      return;
    }

    if (!image.type.startsWith("image/")) {
      console.log("Invalid image type");
      return;
    }

    if (imageDisplayField instanceof HTMLImageElement) {
      setUploadedImageUrl(URL.createObjectURL(image));
      setImageFile(image);
      console.log(URL.createObjectURL(image));
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // TODO: Fix this later as well
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      console.log(e.dataTransfer.files);
      displayUploadedImage(e.dataTransfer.files[0]);
    }
  };

  const handleUploadButtonClick = () => {
    const fileUploadElement = document.getElementById("main-image-upload");
    if (!fileUploadElement) {
      return;
    }
    fileUploadElement.click();
  };

  const handleFileClickUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length != 0) {
      const fileArray = Array.from(e.target.files);
      console.log(fileArray, Boolean(fileArray?.length));
      console.log("About to set files:", fileArray);
      setImageFiles([...fileArray]);
      console.log("Called setImageFiles"); // This should log immediately
    }
  };

  const clearUpload = () => {
    setImageFiles([]);
    // Reset the file input value so the same file can be selected again
    const fileUploadElement = document.getElementById(
      "main-image-upload"
    ) as HTMLInputElement;
    if (fileUploadElement) {
      fileUploadElement.value = "";
    }
  };

  useEffect(() => {
    console.log("imageFiles changed:", imageFiles);
  }, [imageFiles]);

  return (
    <>
      {label && <label className="text-md font-medium">{label}</label>}

      <div className={`${imageFiles?.length ? "" : "hidden"}`}>
        <UploadImagePreviewCarousel uploadedFiles={imageFiles!} />
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
          <IoImagesSharp size={46} color="black" />
          {!imageFiles?.length && (
            <div className="text-center font-medium">
              Click to select from your files or drag and drop an image here!
            </div>
          )}

          <input
            type="file"
            name="mainImageUpload"
            accept=".jpg, .jpeg, .png, .webp"
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
