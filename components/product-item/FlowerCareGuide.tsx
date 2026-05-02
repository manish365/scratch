import React, { memo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store";

function FlowerCareGuide() {
  const { productDetailsPageContent } = useSelector((store: RootState) => store.cms)
  return (
    <div className="mt-4">
      <h4>Flower Care Guide:</h4>
      <div
        className="product-flower-care-guide"
        dangerouslySetInnerHTML={{
          __html: productDetailsPageContent?.flowerCareGuide || "",
        }}
      />
    </div>
  );
}

export default memo(FlowerCareGuide);
