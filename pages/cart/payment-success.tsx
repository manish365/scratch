import { useRouter } from 'next/router';
import React, { useEffect } from 'react'
import { BsPatchCheckFill } from "react-icons/bs";
import Layout from "../../layouts/Main";
import { useDispatch } from 'react-redux';
import {
  removeAllProduct, resetBillingDetails, resetBillingError,
  resetShippingDetails, resetShippingError, resetWorkingCart, setCurrentStep, setGeneratedCart
} from '../../store/reducers/cart';
import Link from 'next/link';

function PaymentSuccess() {
  const router = useRouter();
  const dispatch = useDispatch();
  const showViewOrder = false;

  useEffect(() => {
    // clear the cart items
    dispatch(removeAllProduct());
    dispatch(resetBillingDetails());
    dispatch(resetShippingDetails());
    dispatch(resetBillingError());
    dispatch(resetShippingError());
    dispatch(resetWorkingCart());
    dispatch(setGeneratedCart({ order: "", total: 0 }));
    dispatch(setCurrentStep("shopping-cart"));
  }, [])

  const gotoHomePage = () => {
    router.push("/");
  };

  const gotoMyOrder = () => {
    router.push("/profile/order-history");
  };

  return (
    <Layout>
      <div className="container flex justify-center">
        <div className="flex flex-col w-7/12 shadow px-2 py-4 gap-2 text-center mt-4 mb-4">
          <div className="w-full h-20 flex items-center justify-center text-green-700">
            <BsPatchCheckFill size={50} />
          </div>
          <h3 className="uppercase text-lg bold">Payment Success</h3>
          <p className="text-base">
            Your order has been received and is being processed. <br />
            You will receive an Order Confirmation mail soon. <br /> <br />
            <strong>Thank you for using FlowerChamp</strong> <br />
            If you have any urgent querries, please contact us at{" "}
            <Link href="mailto:admin@flowerschamp.com">admin@flowerschamp.com</Link>
          </p>
          <div className="w-full flex justify-center items-center gap-4">
            {showViewOrder && (
              <button className="btn btn-outline-dark" onClick={gotoMyOrder}>
                View Order
              </button>
            )}
            <button
              className="btn btn-success text-white text-base"
              onClick={gotoHomePage}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default PaymentSuccess;
