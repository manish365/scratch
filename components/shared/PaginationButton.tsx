import React, { memo } from "react";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
interface ButtonPropTypes {
  title: string;
  previous?: boolean;
  next?: boolean;
  isSelected?: boolean;
  onClick: any;
  disabled?: boolean;
}
function PaginationButton({
  title,
  previous,
  next,
  isSelected,
  onClick,
  disabled = false,
}: ButtonPropTypes) {
  const classes = isSelected
    ? "btn bg-slate-800 text-white"
    : "btn bg-slate-300 text-black";
  return (
    <>
      {previous && (
        <button
          className="btn bg-slate-800 text-white flex items-center gap-2"
          onClick={() => onClick("previous")}
          disabled={disabled}
        >
          <BsArrowLeft /> Previous
        </button>
      )}{" "}
      {next && (
        <button
          className="btn bg-slate-800 text-white"
          onClick={() => onClick("next")}
          disabled={disabled}
        >
          Next <BsArrowRight />
        </button>
      )}
      {!previous && !next && (
        <button
          className={classes}
          onClick={() => onClick(title)}
          disabled={disabled}
        >
          {title}
        </button>
      )}
    </>
  );
}

export default memo(PaginationButton);
