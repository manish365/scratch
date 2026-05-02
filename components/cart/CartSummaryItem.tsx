import React, { useEffect, useState } from 'react'
import useDefaultCurrency from "@hooks/useDefaultCurrency";
import { ProductStoreType } from '~types/index';
import { useSelector } from 'react-redux';
import { RootState } from 'store';

interface PropTypes {
  item: ProductStoreType;
  index: number;
  key: string;
}

function CartSummaryItem({ item, index }: PropTypes) {
  const [currency] = useDefaultCurrency();
  const [itemTotal, setItemTotal] = useState(0);
  const { cartItems } = useSelector((store: RootState) => store.cart);

  const getAddOnPrice = () => {
    const _item = cartItems[index];
    if (!_item?.addOns?.length) {
      return 0;
    }
    const price = _item?.addOns?.reduce((sum: number, addon: any) => {
      return sum + +addon.qty * +addon.unitPrice;
    }, 0);
    return price;
  };

  const getItemPrice = () => {
    const _item = cartItems[index];
    const price = ((_item?.eggLess ? +_item?.eggLessPrice : 0) +
        (_item?.glassVaseAdded ? +_item?.glassVasePrice : 0) +
        +_item?.variantPrice) *
      +_item?.qty;
    return price;
  };

  useEffect(() => {
    // console.log("useeffect running");
    const itemPrice = getItemPrice();
    const itemAddOnPrice = getAddOnPrice();
    setItemTotal(itemPrice + itemAddOnPrice);

    return () => {
      setItemTotal(0);
    };
  }, [setItemTotal, cartItems]);
  

  return (
    <div className="flex w-full justify-between items-center">
      <span>
        Cart {index + 1}{" "}
        <span style={{ fontSize: "10px", fontWeight: "800" }}>
          (Code: {item?.code})
        </span>
      </span>
      <span className="total-price">
        {currency} {itemTotal.toFixed(2)}
      </span>
    </div>
  );
}

export default CartSummaryItem
