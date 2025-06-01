import { Dispatch, SetStateAction } from "react";

interface InputFieldProps {
  placeholderText: string;
  inputValue: string;
  setInputValue: Dispatch<SetStateAction<string>>;
  bgColor: string;
  isValid?: boolean;
  label?: string;
}

const InputField = ({
  placeholderText,
  inputValue,
  setInputValue,
  bgColor,
  isValid = true,
  label,
}: InputFieldProps) => {
  return (
    <>
      {label && <label className="text-md font-medium">{label}</label>}
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
      ></input>
    </>
  );
};

export default InputField;
