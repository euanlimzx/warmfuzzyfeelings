import { useState } from "react";
import InputField from "./InputField";
import TextAreaField from "./TextAreaField";
import ImageUploader from "./ImageUpload";
import SubmitFormButton from "./SubmitFormButton";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { FormSubmissionErrorNotification } from "./Notifications";
import FormCompleteModal from "./FormCompleteModal";
import _ from "lodash";

interface NatAndJoshFormProps {
  cardUUID: string;
  birthdayPerson: string;
  cardUUID2?: string;
  birthdayPerson2?: string;
}

// TODO: mobile styling does not really work
const NatAndJoshForm = ({
  cardUUID,
  birthdayPerson,
  cardUUID2,
  birthdayPerson2,
}: NatAndJoshFormProps) => {
  // First person state
  const [name, setName] = useState("");
  const [memoryResponse, setMemoryResponse] = useState("");
  const [descriptionResponse, setDescriptionResponse] = useState("");
  const [finalMessageResponse, setFinalMessageResponse] = useState("");
  const [imageFiles, setImageFiles] = useState<Array<File | null>>([]);
  const [isServerError, setIsServerError] = useState(false);

  // Second person state (only used if cardUUID2 and birthdayPerson2 are provided)
  const [memoryResponse2, setMemoryResponse2] = useState("");
  const [descriptionResponse2, setDescriptionResponse2] = useState("");

  // check input validity for first person
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

  // check input validity for second person
  const [memoryResponseValid2, setMemoryResponseValid2] = useState(true);
  const [descriptionResponseValid2, setDescriptionResponseValid2] =
    useState(true);

  const [showFormCompleteModal, setShowFormCompleteModal] = useState(false);

  const formGap = 4;
  const bgColor = "bg-yellow-200";

  // Check if second person is provided
  const hasSecondPerson = !!(cardUUID2 && birthdayPerson2);

  // @shawn conditionally load these + birthday person too
  const memoryQuestion = ``;
  const descriptionQuestion = ``;
  const finalMessageQuestion = ``;

  // @Shawn: fix this uploading logic
  const uploadImageToS3 = async (
    imageFile: File,
    uploadedImageIdentifier: string
  ) => {
    if (!imageFile) {
      console.error("No image file selected");
      return;
    }

    // First, get the presigned URL from our backend
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/make-a-wish/upload-image`,
      {
        fileName: uploadedImageIdentifier,
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

    return uploadedImageIdentifier;
  };

  const submitForm = async () => {
    setIsLoading(true);

    // check that all fields for first person have been filled up
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

    // check that all fields for second person have been filled up (if applicable)
    let isMemoryValid2 = true;
    let isDescriptionValid2 = true;

    if (hasSecondPerson) {
      isMemoryValid2 = !!memoryResponse2;
      isDescriptionValid2 = !!descriptionResponse2;
      setMemoryResponseValid2(isMemoryValid2);
      setDescriptionResponseValid2(isDescriptionValid2);
    }

    // Check if form is incomplete
    const isFirstPersonIncomplete =
      !memoryResponse ||
      !descriptionResponse ||
      !imageFiles.length ||
      !finalMessageResponse ||
      !name;
    const isSecondPersonIncomplete =
      hasSecondPerson && (!memoryResponse2 || !descriptionResponse2);

    if (isFirstPersonIncomplete || isSecondPersonIncomplete) {
      setIsFormIncomplete(true);
      setIsLoading(false);
      return;
    }

    // Submit first person's form
    const responseUUID = uuidv4();
    const submitReceipt = `${cardUUID}__${responseUUID}`;

    // add image to bucket, name of the image will be the uuid of the of the card + uuid of the response
    const imageUploadRequests = imageFiles.map((imageFile, index) => {
      if (!imageFile) {
        return;
      }

      const imageSequenceReceipt = `${submitReceipt}_${index}`;
      return uploadImageToS3(imageFile, imageSequenceReceipt);
    });

    // try to upload the images all at once
    let results;
    try {
      results = await Promise.all(imageUploadRequests);
    } catch (error) {
      console.error(error);
      setImageSizeAndTypeValid(false);
      setShowImageSizeAndTypeError(true);
      setIsLoading(false);
      return;
    }

    // create a DB entry for the first person's form contents
    const formResponseDetails = {
      cardUUID,
      responseUUID,
      imageUrl: `${submitReceipt}_0`,
      imageUrls: results,
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

    // Submit second person's form if provided
    if (hasSecondPerson) {
      const responseUUID2 = uuidv4();

      const formResponseDetails2 = {
        cardUUID: cardUUID2,
        responseUUID: responseUUID2,
        memoryResponse: memoryResponse2,
        descriptionResponse: descriptionResponse2,
        finalMessageResponse: "",
        imageUrls: [],
        imageUrl: "",
        name: "",
      };

      const formSubmissionResponse2 = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/make-a-wish/upload-card-response`,
        formResponseDetails2
      );

      if (formSubmissionResponse2.status != 201) {
        console.log("error writing second person to the DB");
        setIsLoading(false);
        return;
      }
    }

    localStorage.setItem("submitReceipt", submitReceipt);

    // Reset all form fields
    setMemoryResponse("");
    setDescriptionResponse("");
    setFinalMessageResponse("");
    setImageFiles([]);
    setName("");

    if (hasSecondPerson) {
      setMemoryResponse2("");
      setDescriptionResponse2("");
    }

    setIsLoading(false);
    setMemoryResponseValid(true);
    setDescriptionResponseValid(true);
    setFinalMessageResponseValid(true);
    setImageValid(true);
    setImageSizeAndTypeValid(true);
    setNameValid(true);

    if (hasSecondPerson) {
      setMemoryResponseValid2(true);
      setDescriptionResponseValid2(true);
    }

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
          errorMessage="Woops we ran into an error! Please telegram @euanlimzx for support!"
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
        Let&apos;s make a card for the newly wed couple🥳🎉
      </h1>
      <h2>
        Answer a few quick questions and we&apos;ll help collate them into a
        pretty card ❤️<br></br> If you run into any issues, please telegram @euanlimzx !
      </h2>
      <div className="border-t-2 border-black"></div>

      {/* First person form fields */}
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

      {/* Second person form fields (if provided) */}
      {hasSecondPerson && (
        <form className="w-full">
          <div className="border-t-2 border-black my-4"></div>
          <div className={`flex flex-col gap-${formGap} text-black`}>
            <div className="flex flex-col gap-1 pt-2">
              <InputField
                inputValue={descriptionResponse2}
                setInputValue={setDescriptionResponse2}
                placeholderText={descriptionQuestion}
                bgColor={bgColor}
                isValid={descriptionResponseValid2}
                label={`What are some words or phrases that best describe ${birthdayPerson2}?`}
              />
            </div>
            <div className="flex flex-col gap-1 pt-2">
              <TextAreaField
                inputValue={memoryResponse2}
                setInputValue={setMemoryResponse2}
                placeholderText={memoryQuestion}
                bgColor={bgColor}
                isValid={memoryResponseValid2}
                label={`Tell us about your favorite memory with ${birthdayPerson2}!`}
              />
            </div>
          </div>
        </form>
      )}

      <div className="border-t-2 border-black my-4"></div>

      {/* images that you can upload */}
      <div className="w-full">
        <ImageUploader
          imageFiles={imageFiles}
          setImageFiles={setImageFiles}
          isValid={imageValid && imageSizeAndTypeValid}
          label={`Upload some images of your favorite memories with ${
            hasSecondPerson
              ? `either ${birthdayPerson} or ${birthdayPerson2}`
              : birthdayPerson
          }!`}
          removeImageFromUploadList={removeImageFromUploadList}
        />
      </div>

      {/* Final message fields */}
      <div className="flex flex-col gap-1 pt-2">
        <TextAreaField
          inputValue={finalMessageResponse}
          setInputValue={setFinalMessageResponse}
          placeholderText={finalMessageQuestion}
          bgColor={bgColor}
          isValid={finalMessageResponseValid}
          label={`Any final messages for the newly wed couple?`}
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

export default NatAndJoshForm;
