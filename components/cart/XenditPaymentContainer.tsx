import { server } from '@utils/server';
import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { FiLoader } from "react-icons/fi";

function XenditPaymentContainer() {
  const { generatedOrderNumber } = useSelector(
    (store: RootState) => store.cart
  );
  const { user, profile } = useSelector((store: RootState) => store.user);
  const [success, setSuccess] = useState('');
  const [failure, setFailure] = useState('');
  const [xenditId, setXenditId] = useState("");
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [timer, setTimer] = useState(300) // 5min
  let intervalRef = useRef<any>();
  let intervalPaymentRef = useRef<any>();
  const router = useRouter()

  const createInvoice = async () => {
    try {
      const response = await fetch(`${server}/paypal/capture-order-xendit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: generatedOrderNumber,
          email: user?.email || profile?.email?.address,
        }),
      });
      const finalResult = await response.json();
      if (finalResult.success) {
        setXenditId(finalResult.data?.id);
        const invoiceUrl = finalResult.data.invoice_url;
        window.open(invoiceUrl, "_blank");
        setSuccess(
          `Payment initiated successfully. Please goto the link to complete your payment. ${invoiceUrl}`
        );
        startStatusCheckTimer(finalResult.data?.id);
      }
    } catch (error) {
      console.log("Request failed", error);
      setFailure(`Request failed. We are really sorry for the inconvinience. Please try again after some time.`);
    }
  }

  const getPaymentStatus = async (_xenditId = "") => {
    let updatedXenditId = xenditId;
    if (_xenditId) {
      updatedXenditId = _xenditId;
    }
    if (!updatedXenditId) {
      return;
    }
    try {
      const response = await fetch(`${server}/paypal/xendit-status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: generatedOrderNumber,
          id: updatedXenditId,
        }),
      });
      const finalResult = await response.json();
      if (
        finalResult.success &&
        ["SETTLED", "PAID"].includes(finalResult.data?.status)
      ) {
        // redirect to success url
        setShowLoader(false);
        clearInterval(intervalRef.current);
        clearInterval(intervalPaymentRef.current);
        router.push("/cart/payment-success");
      }
    } catch (error) {
      console.log("Request failed", error);
      setShowLoader(false);
      clearInterval(intervalRef.current);
      clearInterval(intervalPaymentRef.current);
      router.push("/cart/payment-failure");
    }
  }

  const startStatusCheckTimer = (_xenditId = "") => {
    setShowLoader(true);
    intervalPaymentRef.current = setInterval(() => {
      console.log("fetching getPaymentStatus()");
      getPaymentStatus(_xenditId);
    }, 10000);

    intervalRef.current = setInterval(() => {
      setTimer((timer) => {
        if (timer < 1) {
          setShowLoader(false);
          console.log("clearing timer");
          clearInterval(intervalRef.current);
          clearInterval(intervalPaymentRef.current);
          router.push("/cart/payment-failure");
          return 0;
        }
        return timer - 1;
      });
    }, 1000);
  };

  return (
    <div className="flex w-11/12 flex-col">
      <p>
        Pay either using <strong>Debit or Credit Card</strong> or <strong>Paypal</strong>
      </p>
      <button
        className="btn btn-outline-dark btn-lg btn-block"
        onClick={createInvoice}
        disabled={showLoader}
      >
        {showLoader && <FiLoader size={24} className="animate-spin mr-2" />}
        Pay Using Debit or Credit Card or Amex
      </button>
      {success && (
        <>
          <span className="flex items-center w-full bg-green-200 text-green-600 mb-4 px-4 py-2 gap-2">
            {success}
          </span>
          <br />
          <p>
            Please click on{" "}
            <button
              className="btn btn-outline-success"
              onClick={() => getPaymentStatus()}
            >
              Refresh
            </button>{" "}
            if you're not redirected to any page yet.
          </p>
        </>
      )}
      {failure && (
        <span className="flex items-center w-full bg-red-300 text-error mb-4 px-4 py-2 gap-2">
          <strong>Error!</strong>
          {failure}
        </span>
      )}
      {showLoader && (
        <div className="p-4 mt-4 border shadow flex flex-col text-center items-center">
          <FiLoader size={50} className="animate-spin" />
          <h4>Processing Your Payment</h4>
          <p>
            We are processing your order.{" "}
            <strong>
              Please do not hit back or forward button in browser or refresh the
              page.
            </strong>{" "}
            We'll notify you once payment has been processed. (This session will
            expire in {timer} sec)
          </p>
        </div>
      )}
    </div>
  );
}

export default XenditPaymentContainer
