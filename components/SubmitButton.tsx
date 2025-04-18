import { Loader } from "lucide-react";
import React from "react";

type SubmitButtonProps = {
  isSubmitting?: boolean;
  disabled?: boolean;
  type: string;
};

const SubmitButton: React.FC<SubmitButtonProps> = ({
  isSubmitting = false,
  disabled = false,
  type,
}) => {
  const showSpinner = isSubmitting; // `useFormStatus` removed, not needed for client forms

  return (
    <button
      className="w-full bg-gray-200 rounded-lg p-2 cursor-pointer transition duration-200 hover:bg-gray-200 text-black font-semibold"
      type="submit"
      disabled={disabled || isSubmitting}
    >
      {showSpinner ? <Loader className="animate-spin w-5 h- m-auto" /> : type}
    </button>
  );
};

export default SubmitButton;
