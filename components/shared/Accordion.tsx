import React, { useState } from 'react';
import { FiPlus } from "react-icons/fi";
import { FiMinus } from "react-icons/fi";

interface PropTypes { 
  head: string;
  body: string;
}

function SingleAccordion({
  head,
  body
}: PropTypes) {
  const [showBody, setShowBody] = useState<boolean>(false);
  const onHeadClick = () => {
    setShowBody(!showBody)
  }

  return (
    <div className="flex flex-col w-full border transition-all">
      <div
        className="flex px-3 py-2 justify-between items-center h-25 bg-slate-300 cursor-pointer"
        onClick={onHeadClick}
      >
        {head}
        <div>
          {showBody && <FiMinus />}
          {!showBody && <FiPlus />}
        </div>
      </div>
      <div
        className={`flex px-4 transition-all ${
          showBody ? "py-2" : "h-0 overflow-hidden"
        }`}
      >
        {body}
      </div>
    </div>
  );
}

export default SingleAccordion;
