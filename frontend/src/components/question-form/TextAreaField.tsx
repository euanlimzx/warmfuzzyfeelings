import { Dispatch, SetStateAction } from "react";

interface TextAreaFieldProps {
  placeholderText: string;
  inputValue: string;
  setInputValue: Dispatch<SetStateAction<string>>;
  bgColor: string;
  isValid?: boolean;
  label?: string;
}

const TextAreaField = ({
  placeholderText,
  inputValue,
  setInputValue,
  bgColor,
  isValid = true,
  label,
}: TextAreaFieldProps) => {
  return (
    <>
      {label && <label className="text-md font-medium">{label}</label>}
      <textarea
        placeholder={placeholderText}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        rows={5}
        className={`!outline-none ${bgColor} transition-colors duration-[750ms] placeholder-white/70 border-2 border-black w-full text-lg p-3 ${
          !isValid ? "ring-2 ring-red-500" : ""
        }`}
      />
    </>
  );
};

export default TextAreaField;
