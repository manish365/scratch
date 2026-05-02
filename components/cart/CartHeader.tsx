import React, { useState } from "react";
import {
  useDispatch,
  useSelector
} from "react-redux";
import { RootState } from "store";
import { setCurrentStep } from "store/reducers/cart";

function CartHeader() {
  const dispatch = useDispatch();
  const currentStep = useSelector((state: RootState) => state.cart.currentStep);
  const [tabs, _] = useState<any[]>([
    { key: "shopping-cart", value: "Shopping Cart" },
    { key: "order-form", value: "Order Form" },
    { key: "payment", value: "Payment" },
  ]);

  const onUpdateTab = (key: string) => {
    dispatch(setCurrentStep(key));
  };

  return (
    <div className="row mb-4 shopping-step">
      <ul className="w-full">
        {tabs.map((t) => (
          <li
            className={
              t.key === currentStep ? "active-step cursor-pointer" : ""
            }
            key={t.key}
            onClick={() => onUpdateTab(t.key)}
          >
            {t.value}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CartHeader;
