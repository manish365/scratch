import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import Layout from "../../layouts/Main";
import { MdOutlineSmsFailed } from "react-icons/md";
import { useDispatch } from 'react-redux';
import {
  removeAllProduct, resetBillingDetails, resetShippingDetails, resetBillingError,
  resetShippingError, resetWorkingCart, setGeneratedCart, setCurrentStep
} from 'store/reducers/cart';
import Link from 'next/link';


function PaymentFailure() {
  const router = useRouter();
  const dispatch = useDispatch();

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
  }, []);

  const gotoHomePage = () => {
    router.push("/");
  };

  return (
    <Layout>
      <div className="container flex justify-center">
        <div className="flex flex-col w-7/12 shadow px-2 py-4 gap-2 text-center mt-4 mb-4">
          <div className="w-full h-20 flex items-center justify-center text-red-600">
            <MdOutlineSmsFailed size={50} />
          </div>
          <h3 className="uppercase text-lg bold">Payment Failure</h3>
          <p className="text-base">
            Your payment has been timedout and is being processed. <br />
            You will receive an Order Confirmation mail if payment is
            successfull. <br /> <br />
            Please contact us at{" "}
            <Link href="mailto:admin@flowerschamp.com" className='underline'>
              admin@flowerschamp.com
            </Link>{" "}
            for any query.
          </p>
          <div className="w-full flex justify-center items-center gap-4">
            <button
              className="btn btn-danger text-white text-base"
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

export default PaymentFailure;
