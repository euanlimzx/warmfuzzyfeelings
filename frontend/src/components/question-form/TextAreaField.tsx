import { Dispatch, SetStateAction } from "react";

interface TextAreaFieldProps {
  placeholderText: string;
  inputValue: string;
  setInputValue: Dispatch<SetStateAction<string>>;
  bgColor: string;
}

const TextAreaField = ({
  placeholderText,
  inputValue,
  setInputValue,
  bgColor,
}: TextAreaFieldProps) => {
  return (
    <textarea
      placeholder={placeholderText}
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      className={`!outline-none ${bgColor} transition-colors duration-[750ms] placeholder-white/70 p-2 rounded-md w-full text-lg`}
    />
  );
};

export default TextAreaField;
