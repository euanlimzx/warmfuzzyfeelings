// import { AnimatePresence, motion } from "framer-motion";
// import { useState } from "react";

import { useState } from "react";
import InputField from "./InputField";
import TextAreaField from "./TextAreaField";
import ImageUploader from "./ImageUpload";
import SubmitFormButton from "./SubmitFormButton";
import { UUIDTypes, v4 as uuidv4 } from "uuid";
import axios from "axios";

interface BirthdayWishFormProps {
  cardUUID: string;
}

const BirthdayWishForm = ({ cardUUID }: BirthdayWishFormProps) => {
  const [memoryResponse, setMemoryResponse] = useState("");
  const [descriptionResponse, setDescriptionResponse] = useState("");
  const [birthdayPerson, setBirthdayPerson] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<
    null | string | Blob
  >(null);

  const formGap = 4;
  const bgColor = "bg-blue-700";

  // @shawn conditionally load these + birthday person too
  const memoryQuestion = `What was your favourite memory with ${birthdayPerson}`;
  const descriptionQuestion = `Use a few words to describe ${birthdayPerson}`;

  console.log(cardUUID);

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
        return {
          ok: false,
          message: "There were some errors getting the signed URL",
        };
      }

      const { url } = response.data;

      // Upload the file directly to S3 using the presigned URL
      const uploadResponse = await axios.put(url, imageFile, {
        headers: {
          "Content-Type": imageFile.type,
        },
      });

      if (uploadResponse.status !== 200) {
        return {
          ok: false,
          message: "Failed to upload image",
        };
      }

      return { ok: true };
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error; // Re-throw the error to handle it in the calling function
    }
  };

  const submitForm = async () => {
    // check that all fields, including the image, have been filled up

    // if so, first create a random key that we will put as a cookie to mark that this user has already submitted something before
    const responseUUID = uuidv4();
    const submitReceipt = `${cardUUID}__${responseUUID}`;

    // add image to bucket, name of the image will be the uuid of the of the card + uuid of the response
    const imageUploadResponse = await uploadImageToS3(submitReceipt);

    if (!imageUploadResponse?.ok) {
      console.log("Error uploading image");
      return;
    }

    // create a DB entry for the form contents
    const formResponseDetails = {
      cardUUID,
      responseUUID,
      imageUrl: `${submitReceipt}`,
      questionAndResponse: [
        { question: memoryQuestion, response: memoryResponse },
        { question: descriptionQuestion, response: descriptionResponse },
      ],
    };

    const formSubmissionResponse = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/make-a-wish/upload-card-response`,
      formResponseDetails
    );

    if (formSubmissionResponse.status != 201) {
      console.log("error writing to the DB");
      return;
    }

    localStorage.setItem("submitReceipt", submitReceipt);
    setMemoryResponse("");
    setDescriptionResponse("");
    setImageFile(null);
    setUploadedImageUrl(null);
  };

  return (
    <div className={`flex w-128 flex-col gap-${formGap}`}>
      {/* form title */}
      <h1>Dear OPs</h1>

      {/* form fields */}
      <form>
        <div className={`flex flex-col gap-${formGap}`}>
          <InputField
            inputValue={memoryResponse}
            setInputValue={setMemoryResponse}
            placeholderText={memoryQuestion}
            bgColor={bgColor}
          />
          <TextAreaField
            inputValue={descriptionResponse}
            setInputValue={setDescriptionResponse}
            placeholderText={descriptionQuestion}
            bgColor={bgColor}
          />
        </div>
      </form>

      {/* images that you can upload */}
      <div className={`${bgColor} rounded-md`}>
        <ImageUploader
          setImageFile={setImageFile}
          uploadedImageUrl={uploadedImageUrl}
          setUploadedImageUrl={setUploadedImageUrl}
        />
      </div>

      {/* submit button */}
      <div className="flex w-full items-center justify-center">
        <SubmitFormButton submitForm={submitForm} bgColor={bgColor} />
      </div>
    </div>
  );
};

export default BirthdayWishForm;
