import React from 'react'
import { AiOutlineCheck, AiOutlineInfoCircle } from "react-icons/ai";
import { IoAlertOutline } from 'react-icons/io5'
import { PiSealWarningFill } from 'react-icons/pi'
interface PropTypes {
  variant?: "SUCCESS" | "FAILURE" | "WARNING" | "DEFAULT" | "DARK";
  btnText?: string;
  message?: string;
  action: () => void;
}

function SnackBar({
  variant = "DEFAULT",
  btnText = "Close",
  message,
  action,
}: PropTypes) {
  let compiledClasses = "custom-toaster ";
  if (variant === "DEFAULT") {
    compiledClasses += "light bg-white text-black";
  } else {
    compiledClasses += `${variant.toLowerCase()}`;
  }

  return (
    <div className={compiledClasses}>
      <div className="flex gap-4 items-center">
        {variant === "SUCCESS" && <AiOutlineCheck />}
        {variant === "FAILURE" && <IoAlertOutline />}
        {variant === "DEFAULT" && <AiOutlineInfoCircle />}
        {variant === "DARK" && <AiOutlineInfoCircle />}
        {variant === "WARNING" && <PiSealWarningFill />}

        <div className="text-sm semibold">{message}</div>
      </div>
      <button className="btn text-white" onClick={action}>
        {btnText}
      </button>
    </div>
  );
}

export default SnackBar
