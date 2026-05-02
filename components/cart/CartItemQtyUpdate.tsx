import React, { useState } from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  addProduct,
  removeAddonByIndex,
  removeProductByIndex,
  setAddonCountByIndex,
  setCountByIndex,
  updateWorkingCartAddons,
} from "../../store/reducers/cart";
import { RootState } from "store";
import { ProductStoreType } from "~types/index";

interface PropTypes {
  index: number;
  isAddon?: boolean;
  cartIndex?: number;
}

function CartItemQtyUpdate({
  index,
  isAddon = false,
  cartIndex = 0,
}: PropTypes) {
  const [qty, setQty] = useState<number>(1);
  const dispatch = useDispatch();
  const { cartItems } = useSelector((store: RootState) => store.cart);
  const selectedCartAddOn = cartItems[cartIndex].addOns;
  let selectedAddOn: any = {};
  if (selectedCartAddOn) {
    selectedAddOn = selectedCartAddOn[index];
  }

  const onDeleteProduct = () => {
    const ok = confirm("Are you sure you want to remove the item from cart?");
    if (!ok) {
      return;
    }
    if (!isAddon) {
      /***
       * SDH - 2023 - 12 - 26
       * check if the product has any addons
       * if it has addon product selected, we need to add those addons as seperate cart items
       * */
      if (cartItems[index].addOns?.length) {
        const commonCartObj: ProductStoreType = {
          ...cartItems[index],
          addOns: [],
          glassVaseAdded: false,
          eggLess: false,
          addOnQty: 0,
          addOnPrice: 0,
        };
        const addOns = [...cartItems[index].addOns];
        addOns.map((_addon) => {
          const newCartObj = {
            ...commonCartObj,
            id: _addon._id,
            code: _addon.code,
            name: _addon.name,
            qty: _addon.qty,
            variantPrice: _addon.unitPrice,
            thumb: _addon.image,
          };
          dispatch(addProduct({ product: newCartObj, qty: 1 }));
        })
      }
      dispatch(removeProductByIndex(index));
    } else {
      dispatch(removeAddonByIndex({ cartIndex, index }));
    }
    dispatch(updateWorkingCartAddons());
  };

  const onUpdateCount = (value: number) => {
    setQty(value);
    if (!isAddon) {
      dispatch(setCountByIndex({ index, value }));
    } else {
      dispatch(setAddonCountByIndex({ cartIndex, index, qty: value }));
    }
  };

  return (
    <div className="flex flex-column gap-2">
      <div className="flex items-center gap-2">
        {!isAddon && (
          <button
            className="btn btn-outline-secondary"
            onClick={() => onUpdateCount(qty - 1)}
            disabled={qty < 2}
          >
            <AiOutlineMinus />
          </button>
        )}
        {isAddon && (
          <button
            className="btn btn-outline-secondary"
            onClick={() => onUpdateCount(selectedAddOn.qty - 1)}
            disabled={selectedAddOn.qty < 2}
          >
            <AiOutlineMinus />
          </button>
        )}
        <input
          type="number"
          className="w-12 border text-center py-1"
          value={isAddon ? selectedAddOn.qty : qty}
          onChange={($e) => setQty(+$e.target.value)}
          readOnly
        />
        {!isAddon && (
          <button
            className="btn btn-outline-secondary"
            onClick={() => onUpdateCount(qty + 1)}
            disabled={qty > 9}
          >
            <AiOutlinePlus />
          </button>
        )}
        {isAddon && (
          <button
            className="btn btn-outline-secondary"
            onClick={() => onUpdateCount(selectedAddOn.qty + 1)}
            disabled={selectedAddOn.qty > 9}
          >
            <AiOutlinePlus />
          </button>
        )}
      </div>
      <button
        className="btn btn-outline-danger flex items-center justify-center gap-2"
        onClick={onDeleteProduct}
      >
        <MdDelete /> Remove
      </button>
    </div>
  );
}

export default CartItemQtyUpdate;
