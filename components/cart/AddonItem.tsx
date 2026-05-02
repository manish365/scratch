import React from 'react';
import useDefaultCurrency from '@hooks/useDefaultCurrency';
import CartItemQtyUpdate from './CartItemQtyUpdate';

interface PropType {
  addon: any;
  index: number;
  cartIndex: number;
}

function AddonItem({ addon, index, cartIndex }: PropType) {
  const [currency] = useDefaultCurrency();

  return (
    <div className="flex items-center justify-between border-t-1">
      <div className="flex gap-4">
        <div className="flex flex-col gap-2">
          <img
            src={addon?.image}
            alt={addon?.name}
            style={{ height: "134px", width: "160px" }}
            loading="lazy"
          />
        </div>
        <div>
          <p>{addon.name}</p>
          <ul className="list-style-type-disc ml-4">
            <li>
              Standard : {currency} {addon?.unitPrice?.toFixed(2) ?? "0"}
            </li>
          </ul>
        </div>
      </div>
      <div className="flex flex-col justify-center gap-4">
        <div className="flex items-center gap-4">
          <strong>Total:</strong>
          {currency} {(+addon?.unitPrice * +addon?.qty)?.toFixed(2)}
        </div>
        <CartItemQtyUpdate index={index} isAddon={true} cartIndex={cartIndex} />
      </div>
    </div>
  );
}

export default AddonItem
