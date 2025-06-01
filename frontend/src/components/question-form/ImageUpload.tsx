"use client";

import { useEffect, Dispatch, SetStateAction } from "react";
import { X as XIcon } from "lucide-react";
import { CiImageOn } from "react-icons/ci";

interface ImageUploaderProps {
  setImageFile: Dispatch<SetStateAction<File | null>>;
  uploadedImageUrl: null | string | Blob;
  setUploadedImageUrl: Dispatch<SetStateAction<null | string | Blob>>;
  isValid?: boolean;
  label?: string;
}

export default function ImageUploader({
  setImageFile,
  uploadedImageUrl,
  setUploadedImageUrl,
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
    console.log("I have been clicked");
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      displayUploadedImage(e.target.files[0]);
    }
  };

  const clearUpload = () => {
    setUploadedImageUrl(null);
    setImageFile(null);
  };

  // TODO @Shawn: check the device type. if it is a mac, use command + v. if it is windows use ctrl + v
  useEffect(() => {});

  return (
    <>
      {label && <label className="text-md font-medium">{label}</label>}
      <p className="text-sm font-medium text-gray-500">
        Here&apos;s a preview of how your image will appear on the card itself -
        do crop before uploading if it looks funny! (SORRY)
      </p>
      <div className="p-1"></div>
      <div
        className={`relative flex flex-col items-center justify-center gap-4 border-2 border-black pt-2 ${
          !isValid ? "ring-2 ring-red-500" : ""
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {/* TODO: round image, improve proportions on image rounding */}
        <img
          alt="uploadedMainImage"
          id="uploaded-main-image-preview"
          className={`${
            uploadedImageUrl ? "" : "hidden"
          } h-96 w-full rounded-md p-5`}
          src={uploadedImageUrl || undefined}
        ></img>

        {uploadedImageUrl && (
          <button
            className="absolute bottom-8 right-8 cursor-pointer rounded-full bg-red-500 p-2 hover:bg-red-600 transition-colors shadow-lg"
            onClick={clearUpload}
          >
            <XIcon color="#ffffff" strokeWidth={1.25} />
          </button>
        )}

        <CiImageOn
          size={96}
          color="black"
          className={`${uploadedImageUrl ? "hidden" : ""}`}
        />
        {!uploadedImageUrl && (
          <div className="m-2 flex flex-col gap-2">
            <button
              className="cursor-pointer border-2 border-black"
              onClick={handleUploadButtonClick}
            >
              Browse
            </button>
            <p>or drag and drop</p>
          </div>
        )}

        <input
          type="file"
          name="mainImageUpload"
          accept=".jpg, .jpeg, .png, .webp"
          id="main-image-upload"
          className="hidden"
          onChange={handleFileClickUpload}
        />
      </div>
    </>
  );
}
