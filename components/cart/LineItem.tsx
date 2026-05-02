import React from "react";
import { ProductStoreType } from "~types/index";

function LineItem({ item }: { item: ProductStoreType }) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center justify-center w-3/12">
        <img
          src={item.thumb}
          alt={item.name}
          style={{ width: "80px", height: "80px" }}
        />
      </div>
      <div className="grow flex flex-column gap-4">
        <span>{item.name}</span>
        <span>Product ID: {item.code}</span>
      </div>
    </div>
  );
}

export default LineItem;
