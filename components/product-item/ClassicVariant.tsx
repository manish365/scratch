import React from 'react'
import VariantCard from "./VariantCard";
interface PropTypes {
  onUpdateVariant: any;
  description: string;
  price: any;
  priceUSD: number;
  isSelected?: any;
}

function ClassicVariant({ onUpdateVariant, description, price, priceUSD, isSelected }: PropTypes) {
  return (
    <div className="flex justify-start gap-4">
      <input
        className="appear-auto"
        type="radio"
        name="productVariant"
        id="flexRadioDefault1"
        value={"classic"}
        checked={isSelected}
        onChange={() => onUpdateVariant("classic")}
      />
      <div className="flex items-center">
        <img
          src="https://www.uaeflowers.com/assets/template/templateuae/image/fl1.png"
          style={{ height: "42px", width: "32px" }}
          alt="Flower Icon"
        />
      </div>
      <VariantCard
        title={"Classic"}
        desc={description}
        price={price?.toFixed(2)}
        priceUSD={priceUSD}
      />
    </div>
  );
}

export default ClassicVariant
