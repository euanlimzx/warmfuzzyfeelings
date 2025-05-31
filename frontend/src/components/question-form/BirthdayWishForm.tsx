"use client";

import { useState } from "react";
import FormInputField from "./InputField";
import ImageUploader from "./ImageUpload";
import RainbowButton from "./RainbowButton";

export default function BirthdayWishForm() {
  const [oneWordDescription, setOneWordDescription] = useState("");
  const [placeholderOne, setPlaceholderOne] = useState("");
  const [placeholderTwo, setPlaceholderTwo] = useState("");

  // flow of form:
  // Dear XYZ (should be a title field that can be changed if you have a nickname for them)
  // Here's one word I think best describes you:
  //
  const formGap = 4;

  return (
    <div className={`flex max-w-xl flex-1 flex-col gap-${formGap} `}>
      {/* form title */}
      <h1>Dear OPs</h1>

      {/* form fields */}
      <form>
        <div className={`flex flex-col gap-${formGap}`}>
          <FormInputField
            inputValue={oneWordDescription}
            setInputValue={setOneWordDescription}
            placeHolderText={"Here's the word I think best describes you"}
          ></FormInputField>
          <FormInputField
            inputValue={placeholderOne}
            setInputValue={setPlaceholderOne}
            placeHolderText={"placeholder one"}
            longerInput
          ></FormInputField>
          <FormInputField
            inputValue={placeholderTwo}
            setInputValue={setPlaceholderTwo}
            placeHolderText={"placeholder two"}
          ></FormInputField>
        </div>
      </form>

      {/* images that you can upload */}
      <ImageUploader />

      {/* submit button */}
      <div className="flex w-full items-center justify-center">
        <RainbowButton />
      </div>
    </div>
  );
}
