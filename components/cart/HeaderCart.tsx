import { useRouter } from "next/router";
import React, { memo } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { setCurrentStep } from "../../store/reducers/cart";

function HeaderCart() {
  const router = useRouter()
  const { cartItems } = useSelector((store: RootState) => store.cart);
  const dispatch = useDispatch();

  const gotoCart = () => {
    dispatch(setCurrentStep("shopping-cart"));
    router.push('/cart/summary')
  }
  return (
    <a onClick={gotoCart} className="cursor-pointer">
      <i style={{ fontSize: "16px", fontWeight: "bold" }}>
        <FaShoppingCart />
      </i>
      <span className="mobile-view cart-counter">{cartItems.length}</span>
      <span className="desktop-view">Cart ({cartItems.length})</span>
    </a>
  );
}

export default memo(HeaderCart);
