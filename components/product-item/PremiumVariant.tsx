import React from "react";
import VariantCard from "./VariantCard";
interface PropTypes {
  onUpdateVariant: any;
  description: string;
  price: any;
  priceUSD: number;
  title?: string;
  isSelected?: boolean;
}

function PremiumVariant({
  onUpdateVariant,
  description,
  price,
  priceUSD,
  title = "Premium",
  isSelected = false,
}: PropTypes) {
  return (
    <div className="flex justify-start gap-4">
      <input
        className="appear-auto"
        type="radio"
        name="productVariant"
        id="flexRadioPremium"
        value={"Premium"}
        checked={isSelected}
        onChange={() => onUpdateVariant("three-tier")}
      />
      <div className="flex items-center">
        <img
          src="https://www.uaeflowers.com/assets/template/templateuae/image/fl2.png"
          style={{ height: "42px", width: "32px" }}
          alt="Flower Icon"
        />
      </div>
      <VariantCard
        title={title}
        desc={description}
        price={price?.toFixed(2)}
        priceUSD={priceUSD}
        htmlFor={"flexRadioPremium"}
      />
    </div>
  );
}

export default PremiumVariant;
