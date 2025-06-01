import { useState } from "react";
import InputField from "./InputField";
import TextAreaField from "./TextAreaField";
import ImageUploader from "./ImageUpload";
import SubmitFormButton from "./SubmitFormButton";
import { UUIDTypes, v4 as uuidv4 } from "uuid";
import axios from "axios";
import { FormSubmissionErrorNotification } from "./Notifications";
import FormCompleteModal from "./FormCompleteModal";

interface BirthdayWishFormProps {
  cardUUID: string;
  birthdayPerson: string;
}

// TODO: mobile styling does not really work
const BirthdayWishForm = ({
  cardUUID,
  birthdayPerson,
}: BirthdayWishFormProps) => {
  const [memoryResponse, setMemoryResponse] = useState("");
  const [descriptionResponse, setDescriptionResponse] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<
    null | string | Blob
  >(null);
  const [isServerError, setIsServerError] = useState(false);

  // check input validity
  const [isFormIncomplete, setIsFormIncomplete] = useState(false);
  const [memoryResponseValid, setMemoryResponseValid] = useState(true);
  const [descriptionResponseValid, setDescriptionResponseValid] =
    useState(true);
  const [imageValid, setImageValid] = useState(true);
  const [imageSizeAndTypeValid, setImageSizeAndTypeValid] = useState(true);
  const [showImageSizeAndTypeError, setShowImageSizeAndTypeError] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [showFormCompleteModal, setShowFormCompleteModal] = useState(false);

  const formGap = 4;
  const bgColor = "bg-blue-700";

  // @shawn conditionally load these + birthday person too
  const memoryQuestion = `What was your favourite memory with ${birthdayPerson}`;
  const descriptionQuestion = `Use a few words to describe ${birthdayPerson}`;

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
          fileSize: imageFile.size,
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
      await axios.put(url, imageFile, {
        headers: {
          "Content-Type": imageFile.type,
        },
      });

      return { ok: true };
    } catch (error) {
      console.error(error);
      setImageSizeAndTypeValid(false);
      setShowImageSizeAndTypeError(true);
      return {
        ok: false,
        imageValidityIssue: true,
      };
    }
  };

  const submitForm = async () => {
    setIsLoading(true);

    // check that all fields, including the image, have been filled up
    const isMemoryValid = !!memoryResponse;
    const isDescriptionValid = !!descriptionResponse;
    const isImageValid = !!imageFile;

    setMemoryResponseValid(isMemoryValid);
    setDescriptionResponseValid(isDescriptionValid);
    setImageValid(isImageValid);

    if (!memoryResponse || !descriptionResponse || !imageFile) {
      setIsFormIncomplete(true);
      setIsLoading(false);
      return;
    }

    // if so, first create a random key that we will put as a cookie to mark that this user has already submitted something before
    const responseUUID = uuidv4();
    const submitReceipt = `${cardUUID}__${responseUUID}`;

    // add image to bucket, name of the image will be the uuid of the of the card + uuid of the response
    const imageUploadResponse = await uploadImageToS3(submitReceipt);

    if (!imageUploadResponse?.ok) {
      console.log("Error uploading image");
      setIsLoading(false);

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
      setIsLoading(false);

      return;
    }

    localStorage.setItem("submitReceipt", submitReceipt);
    setMemoryResponse("");
    setDescriptionResponse("");
    setImageFile(null);
    setUploadedImageUrl(null);
    setIsLoading(false);
    setMemoryResponseValid(true);
    setDescriptionResponseValid(true);
    setImageValid(true);
    setImageSizeAndTypeValid(true);
    setShowFormCompleteModal(true);
  };

  return (
    <div className={`flex w-128 flex-col gap-${formGap} relative`}>
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
      <h1>Dear {birthdayPerson}</h1>

      {/* form fields */}
      <form>
        <div className={`flex flex-col gap-${formGap}`}>
          <InputField
            inputValue={memoryResponse}
            setInputValue={setMemoryResponse}
            placeholderText={memoryQuestion}
            bgColor={bgColor}
            isValid={memoryResponseValid}
          />
          <TextAreaField
            inputValue={descriptionResponse}
            setInputValue={setDescriptionResponse}
            placeholderText={descriptionQuestion}
            bgColor={bgColor}
            isValid={descriptionResponseValid}
          />
        </div>
      </form>

      {/* images that you can upload */}
      <div className={`${bgColor} rounded-md`}>
        <ImageUploader
          setImageFile={setImageFile}
          uploadedImageUrl={uploadedImageUrl}
          setUploadedImageUrl={setUploadedImageUrl}
          isValid={imageValid && imageSizeAndTypeValid}
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
