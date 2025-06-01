import { Dispatch, SetStateAction } from "react";

interface TextAreaFieldProps {
  placeholderText: string;
  inputValue: string;
  setInputValue: Dispatch<SetStateAction<string>>;
  bgColor: string;
  isValid?: boolean;
}

const TextAreaField = ({
  placeholderText,
  inputValue,
  setInputValue,
  bgColor,
  isValid = true,
}: TextAreaFieldProps) => {
  return (
    <textarea
      placeholder={placeholderText}
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      className={`!outline-none ${bgColor} transition-colors duration-[750ms] placeholder-white/70 p-2 border-2 border-black w-full text-lg ${
        !isValid ? "ring-2 ring-red-500" : ""
      }`}
    />
  );
};

export default TextAreaField;
