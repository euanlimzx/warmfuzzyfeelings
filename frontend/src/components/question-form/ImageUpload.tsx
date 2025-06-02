"use client";

import { useEffect, Dispatch, SetStateAction } from "react";
import { FaTrashCan } from "react-icons/fa6";
import { IoImagesSharp } from "react-icons/io5";

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

  useEffect(() => {
    console.log(uploadedImageUrl);
  }, [uploadedImageUrl]);

  return (
    <>
      {label && <label className="text-md font-medium">{label}</label>}
      <p
        className={`text-sm font-medium text-gray-500 ${
          uploadedImageUrl ? "" : "hidden"
        }`}
      >
        Here&apos;s a preview of how your image will appear on the card itself -
        do crop before uploading if it looks funny! (SORRY)
      </p>
      <div className="p-1"></div>

      <div className={`${uploadedImageUrl ? "" : "hidden"}`}>
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
            <div className="flex w-full justify-end py-4">
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
      </div>

      <div
        className={`${
          uploadedImageUrl ? "hidden" : ""
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
          {!uploadedImageUrl && (
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
          />
        </div>
      </div>
    </>
  );
}
