import React, { memo } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
interface PropTypes {
  showLabel?: boolean;
  height?: string;
  width?: string;
}
function Loader({ showLabel = true, height = 'h-32', width = 'w-32' }: PropTypes) {
  return (
    <div className={`flex items-center justify-center ${height} ${width} gap-2`}>
      <AiOutlineLoading3Quarters className="animate-spin" />
      {showLabel && <span>Loading data</span>}
    </div>
  );
}

export default memo(Loader);
