import { ChangeEvent, Dispatch, SetStateAction } from "react";
import GlassConatainer from "./GlassContainer";

interface FormInputFieldProps {
  inputValue: string;
  setInputValue: Dispatch<SetStateAction<string>>;
  placeHolderText: string;
  longerInput?: boolean;
}

// TODO: @Shawn, add max width
// TODO: @Shawn, remove the padding when using a text area so the bottom left corner aligns more nicely
export default function FormInputField({
  inputValue,
  setInputValue,
  placeHolderText,
  longerInput = false,
}: FormInputFieldProps) {
  const handleChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setInputValue(e.target.value);
  };
  const inputClassNames = "!outline-none w-full";

  return (
    <GlassConatainer>
      {longerInput ? (
        <textarea
          className={inputClassNames}
          value={inputValue}
          onChange={handleChange}
          placeholder={placeHolderText}
        ></textarea>
      ) : (
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          className={inputClassNames}
          placeholder={placeHolderText}
        />
      )}
    </GlassConatainer>
  );
}
