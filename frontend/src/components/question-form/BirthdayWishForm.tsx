import { useState } from "react";
import InputField from "./InputField";
import TextAreaField from "./TextAreaField";
import ImageUploader from "./ImageUpload";
import SubmitFormButton from "./SubmitFormButton";
import { UUIDTypes, v4 as uuidv4 } from "uuid";
import axios from "axios";
import { FormSubmissionErrorNotification } from "./Notifications";
import FormCompleteModal from "./FormCompleteModal";
import _ from "lodash";

interface BirthdayWishFormProps {
  cardUUID: string;
  birthdayPerson: string;
}

// TODO: mobile styling does not really work
const BirthdayWishForm = ({
  cardUUID,
  birthdayPerson,
}: BirthdayWishFormProps) => {
  const [name, setName] = useState("");
  const [memoryResponse, setMemoryResponse] = useState("");
  const [descriptionResponse, setDescriptionResponse] = useState("");
  const [finalMessageResponse, setFinalMessageResponse] = useState("");
  const [imageFiles, setImageFiles] = useState<Array<File | null>>([]);
  const [isServerError, setIsServerError] = useState(false);

  // check input validity
  const [nameValid, setNameValid] = useState(true);
  const [isFormIncomplete, setIsFormIncomplete] = useState(false);
  const [memoryResponseValid, setMemoryResponseValid] = useState(true);
  const [descriptionResponseValid, setDescriptionResponseValid] =
    useState(true);
  const [finalMessageResponseValid, setFinalMessageResponseValid] =
    useState(true);
  const [imageValid, setImageValid] = useState(true);
  const [imageSizeAndTypeValid, setImageSizeAndTypeValid] = useState(true);
  const [showImageSizeAndTypeError, setShowImageSizeAndTypeError] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [showFormCompleteModal, setShowFormCompleteModal] = useState(false);

  const formGap = 4;
  const bgColor = "bg-yellow-200";

  // @shawn conditionally load these + birthday person too
  const memoryQuestion = ``;
  const descriptionQuestion = ``;
  const finalMessageQuestion = ``;

  // @Shawn: fix this uploading logic
  // const uploadImageToS3 = async (uuid: UUIDTypes) => {
  //   if (!imageFile) {
  //     console.error("No image file selected");
  //     return;
  //   }

  //   try {
  //     // First, get the presigned URL from our backend
  //     const response = await axios.post(
  //       `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/make-a-wish/upload-image`,
  //       {
  //         fileName: uuid,
  //         fileType: imageFile.type,
  //         fileSize: imageFile.size,
  //       },
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     if (!response.data.ok) {
  //       return {
  //         ok: false,
  //         message: "There were some errors getting the signed URL",
  //       };
  //     }

  //     const { url } = response.data;

  //     // Upload the file directly to S3 using the presigned URL
  //     await axios.put(url, imageFile, {
  //       headers: {
  //         "Content-Type": imageFile.type,
  //       },
  //     });

  //     return { ok: true };
  //   } catch (error) {
  //     console.error(error);
  //     setImageSizeAndTypeValid(false);
  //     setShowImageSizeAndTypeError(true);
  //     return {
  //       ok: false,
  //       imageValidityIssue: true,
  //     };
  //   }
  // };

  const submitForm = async () => {
    setIsLoading(true);

    // check that all fields, including the image, have been filled up
    const isMemoryValid = !!memoryResponse;
    const isDescriptionValid = !!descriptionResponse;
    const isImageValid = !!imageFiles.length;
    const isFinalMessageValid = !!finalMessageResponse;
    const isNameValid = !!name;
    setMemoryResponseValid(isMemoryValid);
    setDescriptionResponseValid(isDescriptionValid);
    setFinalMessageResponseValid(isFinalMessageValid);
    setImageValid(isImageValid);
    setNameValid(isNameValid);
    if (
      !memoryResponse ||
      !descriptionResponse ||
      !imageFiles.length ||
      !finalMessageResponse ||
      !name
    ) {
      setIsFormIncomplete(true);
      setIsLoading(false);
      return;
    }

    // if so, first create a random key that we will put as a cookie to mark that this user has already submitted something before
    const responseUUID = uuidv4();
    const submitReceipt = `${cardUUID}__${responseUUID}`;

    // add image to bucket, name of the image will be the uuid of the of the card + uuid of the response

    // const imageUploadResponse = await uploadImageToS3(submitReceipt);

    // if (!imageUploadResponse?.ok) {
    //   console.log("Error uploading image");
    //   setIsLoading(false);

    //   return;
    // }

    // create a DB entry for the form contents

    //todo @Shawn: this might need to change? cos our json is changing right
    const formResponseDetails = {
      cardUUID,
      responseUUID,
      imageUrl: `${submitReceipt}`,
      memoryResponse,
      finalMessageResponse,
      descriptionResponse,
      name,
    };

    const formSubmissionResponse = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/make-a-wish/upload-card-response`,
      formResponseDetails
    );

    if (formSubmissionResponse.status != 201) {
      console.log("error writing to the DB");
      setIsLoading(false);

      return;
    }

    localStorage.setItem("submitReceipt", submitReceipt);
    setMemoryResponse("");
    setDescriptionResponse("");
    setFinalMessageResponse("");
    setImageFiles([]);
    setIsLoading(false);
    setMemoryResponseValid(true);
    setDescriptionResponseValid(true);
    setFinalMessageResponseValid(true);
    setImageValid(true);
    setImageSizeAndTypeValid(true);
    setShowFormCompleteModal(true);
  };

  const removeImageFromUploadList = (file: File) => {
    const newSet = imageFiles.filter((imageFile) => {
      return !_.isEqual(file, imageFile);
    });
    setImageFiles(newSet);
  };

  return (
    <div
      className={`flex flex-col gap-${formGap} relative bg-white p-4 sm:p-10 border-2 max-h-[85vh] overflow-y-auto border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] w-full`}
    >
      {isServerError && (
        <FormSubmissionErrorNotification
          errorMessage="Well, this is awkward... We couldn't handle what you threw at us."
          removeNotif={() => setIsServerError(false)}
        />
      )}

      {isFormIncomplete && (
        <FormSubmissionErrorNotification
          errorMessage="Almost there! A few fields are still waiting for some love"
          removeNotif={() => setIsFormIncomplete(false)}
        />
      )}

      {showImageSizeAndTypeError && (
        <FormSubmissionErrorNotification
          errorMessage="Whoa there! That image is chonkier than we can handle. Keep it under 10MB, yeah?"
          removeNotif={() => setShowImageSizeAndTypeError(false)}
        />
      )}

      <FormCompleteModal
        isOpen={showFormCompleteModal}
        setIsOpen={setShowFormCompleteModal}
        birthdayPerson={birthdayPerson}
        bgColor={bgColor}
        cardUUID={cardUUID}
      />

      {/* form title */}
      <h1 className="text-2xl sm:text-4xl font-semibold">
        Let&apos;s make a card for {birthdayPerson}&apos;s Birthday{""}🥳🎉
      </h1>
      <h2>
        Answer a few quick questions and we&apos;ll help collate them into a
        pretty card ❤️
      </h2>
      <div className="border-t-2 border-black"></div>

      {/* form fields */}
      <form className="w-full">
        <div className={`flex flex-col gap-${formGap} text-black`}>
          <div className="flex flex-col gap-1 pt-2">
            <InputField
              placeholderText=""
              inputValue={name}
              setInputValue={setName}
              bgColor={bgColor}
              isValid={nameValid}
              label={`What's your name?`}
            />
          </div>
          <div className="flex flex-col gap-1 pt-2">
            <InputField
              inputValue={descriptionResponse}
              setInputValue={setDescriptionResponse}
              placeholderText={descriptionQuestion}
              bgColor={bgColor}
              isValid={descriptionResponseValid}
              label={`What are some words or phrases that best describe ${birthdayPerson}?`}
            />
          </div>
          <div className="flex flex-col gap-1 pt-2">
            <TextAreaField
              inputValue={memoryResponse}
              setInputValue={setMemoryResponse}
              placeholderText={memoryQuestion}
              bgColor={bgColor}
              isValid={memoryResponseValid}
              label={`Tell us about your favorite memory with ${birthdayPerson}!`}
            />
          </div>
        </div>
      </form>

      {/* images that you can upload */}
      <div className="w-full">
        <ImageUploader
          imageFiles={imageFiles}
          setImageFiles={setImageFiles}
          isValid={imageValid && imageSizeAndTypeValid}
          label={`Upload an image of your favorite memory with ${birthdayPerson}!`}
          removeImageFromUploadList={removeImageFromUploadList}
        />
      </div>

      <div className="flex flex-col gap-1 pt-2">
        <TextAreaField
          inputValue={finalMessageResponse}
          setInputValue={setFinalMessageResponse}
          placeholderText={finalMessageQuestion}
          bgColor={bgColor}
          isValid={finalMessageResponseValid}
          label={`Any final birthday messages for ${birthdayPerson}?`}
        />
      </div>

      {/* submit button */}
      <div className="flex w-full items-center justify-center mt-4">
        <SubmitFormButton
          submitForm={submitForm}
          bgColor={bgColor}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default BirthdayWishForm;
