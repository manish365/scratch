import React, { useEffect, useState } from "react";
import Layout from "../../layouts/Main";
import Breadcrumb from "../../components/breadcrumb";
import {
  CartFooter, CartHeader, CartItem, CartOffer, CartSummary, GuestCheckout, OrderReview,
  PaymentContainer, ShippingDetails
} from "@components/cart";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { server } from "utils/server";
import { setCartMeta } from "../../store/reducers/cart";
import { useRouter } from "next/router";

function Summary() {
  const {currentStep, cartItems} = useSelector(
    (state: RootState) => state.cart
  );
  const [error, setError] = useState<string>("");
  const dispatch = useDispatch();
  const router = useRouter()

  useEffect(() => {
    async function fetchMetaData() {
      try {
        const res = await fetch(`${server}/cart-meta`);
        const pdm = await res.json();
        if (pdm?.success) {
          dispatch(setCartMeta(pdm.results));
          setError("");
        }
      } catch (error) {
        setError("Sorry! Cannot get product details meta!");
      }
    }
    fetchMetaData();

    return () => {
      setError('');
    };
  }, [setError]);

  const gotoProductList = () => {
    router.push("/list/category/flowers");
  }

  return (
    <Layout>
      <Breadcrumb pName={"Shopping Cart"} />
      {cartItems.length > 0 && (
        <div className="container cart-container">
          <CartHeader />
          {currentStep === "shopping-cart" && (
            <div className="row">
              {error && <div className="col-xs-12 col-md-12">{error}</div>}
              <div className="col-xs-12 col-sm-8 col-md-8 left-cart">
                {!error &&
                  cartItems.map((ci, index) => (
                    <div className="col-xs-12" key={ci?.id}>
                      <CartItem item={ci} key={ci?.id} index={index} />
                    </div>
                  ))}
              </div>
              <div className="col-xs-12 col-sm-4 col-md-4 right-cart">
                <CartSummary />
                <GuestCheckout />
                <CartOffer />
              </div>
            </div>
          )}
          {currentStep === "order-form" && (
            <div className="row">
              <div className="col-xs-12 col-sm-8 col-md-8 left-cart">
                <ShippingDetails />
              </div>
              <div className="col-xs-12 col-sm-4 col-md-4 right-cart">
                <OrderReview />
              </div>
            </div>
          )}
          {currentStep === "payment" && <PaymentContainer />}
          <CartFooter />
        </div>
      )}
      {cartItems.length === 0 && (
        <div className="container cart-container">
          <div className="row">
            <div className="col-lg-12 flex flex-col items-center justify-center py-4">
              <h2>Your shopping basket is currently empty.</h2>
              <p>Please select your item(s) again, and place your order.</p>
              <button className="btn btn-outline-dark" onClick={gotoProductList}>Add more products</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default Summary;
