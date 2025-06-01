import { Dispatch, SetStateAction } from "react";

interface InputFieldProps {
  placeholderText: string;
  inputValue: string;
  setInputValue: Dispatch<SetStateAction<string>>;
  bgColor: string;
  isValid?: boolean;
}

const InputField = ({
  placeholderText,
  inputValue,
  setInputValue,
  bgColor,
  isValid = true,
}: InputFieldProps) => {
  return (
    <input
      type="text"
      placeholder={placeholderText}
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      className={`
        !outline-none 
        ${bgColor} 
        transition-colors 
        duration-[750ms] 
        placeholder-white/70 
        p-2 
        w-full 
        text-lg
        border-2
        border-black
        ${!isValid ? "ring-2 ring-red-500" : ""}
      `}
    />
  );
};

export default InputField;
