// import { AnimatePresence, motion } from "framer-motion";
// import { useState } from "react";

import { useState } from "react";
import InputField from "./InputField";
import TextAreaField from "./TextAreaField";
import ImageUploader from "./ImageUpload";
import SubmitFormButton from "./SubmitFormButton";
import { UUIDTypes, v4 as uuidv4 } from "uuid";
import axios from "axios";

const BirthdayWishForm = () => {
  const [placeholderOne, setPlaceholderOne] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const formGap = 4;
  const bgColor = "bg-blue-700";

  const uploadImageToS3 = async (uuid: UUIDTypes) => {
    if (!imageFile) {
      console.error("No image file selected");
      return;
    }

    try {
      // First, get the presigned URL from our backend
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/make-a-wish/upload-image`,
        {
          fileName: uuid,
          fileType: imageFile.type,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.data.ok) {
        throw new Error("Failed to get upload URL");
      }

      const { url } = response.data;
      console.log(url);

      // Upload the file directly to S3 using the presigned URL
      const uploadResponse = await axios.put(url, imageFile, {
        headers: {
          "Content-Type": imageFile.type,
        },
      });

      if (uploadResponse.status !== 200) {
        throw new Error("Failed to upload image");
      }

      console.log(uploadResponse);

      return uploadResponse.data;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error; // Re-throw the error to handle it in the calling function
    }
  };

  const submitForm = async () => {
    // check that all fields, including the image, have been filled up

    // if so, first create a random key that we will put as a cookie to mark that this user has already submitted something before
    const responseUUID = uuidv4();
    const submitReceipt = responseUUID + "__form UUID";
    localStorage.setItem("submitReceipt", submitReceipt);

    // add image to bucket, name of the image will be the uuid of the of the card + uuid of the response
    const s3ImageUrl = await uploadImageToS3(submitReceipt);

    // create a DB entry for the form contents
    const formResponseDetails = {
      responseUUID,
      imageUrl: `${process.env.AWS_CLOUDFRONT_URL}/${submitReceipt}`,
      questionAndResponse: {
        question1: placeholderOne,
      },
    };
  };

  return (
    <div className={`flex w-128 flex-col gap-${formGap}`}>
      {/* form title */}
      <h1>Dear OPs</h1>

      {/* form fields */}
      <form>
        <div className={`flex flex-col gap-${formGap}`}>
          <InputField
            inputValue={placeholderOne}
            setInputValue={setPlaceholderOne}
            placeholderText={"Here's the word I think best describes you"}
            bgColor={bgColor}
          />
          <TextAreaField
            inputValue={placeholderOne}
            setInputValue={setPlaceholderOne}
            placeholderText={"Here's the word I think best describes you"}
            bgColor={bgColor}
          />
        </div>
      </form>

      {/* images that you can upload */}
      <div className={`${bgColor} rounded-md`}>
        <ImageUploader setImageFile={setImageFile} />
      </div>

      {/* submit button */}
      <div className="flex w-full items-center justify-center">
        <SubmitFormButton submitForm={submitForm} bgColor={bgColor} />
      </div>
    </div>
  );
};

export default BirthdayWishForm;
