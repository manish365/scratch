import React, { useEffect, useRef, useState } from 'react'
import { IoMdClose } from "react-icons/io";
import { BsCartCheck } from "react-icons/bs";
import useDefaultCurrency from '@hooks/useDefaultCurrency';
import { getExchageRateFromState } from "@utils/localstorage";
import { server } from '@utils/server';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { useRouter } from 'next/router';
import { FiLoader } from 'react-icons/fi';
import { FUNDING, PayPalButtons, PayPalScriptProvider, ReactPayPalScriptOptions } from '@paypal/react-paypal-js';
interface PropTypes {
  orderNumber: string;
  orderTotal: number;
  totalDeliveryPrice: number;
  discount: number;
  onClose: any;
  email?: string;
}

function PaymentPopup({
  orderNumber,
  orderTotal = 0,
  totalDeliveryPrice = 0,
  discount = 0,
  onClose,
  email = ''
}: PropTypes) {
  const [currency] = useDefaultCurrency();
  const currentRate = getExchageRateFromState();
  const [totalPriceDollar, setTotalPriceDollar] = useState<number>(0);
  const [success, setSuccess] = useState("");
  const [failure, setFailure] = useState("");
  const [xenditId, setXenditId] = useState("");
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [timer, setTimer] = useState(300); // 5min
  let intervalRef = useRef<any>();
  let intervalPaymentRef = useRef<any>();
  const { profile } = useSelector((store: RootState) => store.user);
  const router = useRouter();

  useEffect(() => {
    setTotalPriceDollar((+orderTotal + +totalDeliveryPrice - +discount) / +currentRate);

    return () => {
      setTotalPriceDollar(0);
    };
  }, [setTotalPriceDollar]);

  const options: ReactPayPalScriptOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "",
    currency: "USD",
    intent: "capture",
  };

  const processPayment = async () => {
    try {
      const response = await fetch(`${server}/paypal/capture-order-xendit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: orderNumber,
          email: email ? email : profile?.email?.address,
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
      setFailure(
        `Request failed. We are really sorry for the inconvinience. Please try again after some time.`
      );
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
          orderId: orderNumber,
          id: updatedXenditId,
        }),
      });
      const finalResult = await response.json();
      if (finalResult.success && ["SETTLED", "PAID"].includes(finalResult.data?.status)) {
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
  };

  const onDialogClose = async () => {
    setShowLoader(false);
    clearInterval(intervalRef.current);
    clearInterval(intervalPaymentRef.current);
    onClose();
  }

  const paypalCreateOrder = async () => {
    try {
      const response = await fetch(`${server}/paypal/create-order`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          email: email ? email : profile?.email?.address,
          orderPrice: totalPriceDollar,
          order: orderNumber,
        }),
      });
      const res = await response.json();
      if (res) {
        return res.data.order;
      } else {
        return "";
      }
    } catch (error) {
      return null;
    }
  };

  const paypalCaptureOrder = async (orderId: string): Promise<any> => {
    try {
      const response = await fetch(`${server}/paypal/capture-order`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          orderId,
          orderCode: orderNumber,
          email: email ? email : profile?.email?.address,
        }),
      });
      const res = await response.json();
      if (res?.success) {
        // goto success screen
        router.push("/cart/payment-success");
      } else {
        setFailure('Payment failed! Please try again later!');
        router.push("/cart/payment-failure");
      }
    } catch (err) {
      // Order is not successful
      console.log("============= [error]", err);
      setFailure('Payment failed! Please try again later!');
      router.push("/cart/payment-failure");
    }
  };

  const paypalCancelOrder = async (data: any, actions: any) => {
    console.log("Operation cancelled");
    console.log(data, actions);
    setFailure("Payment cancelled! Please try again later!");
  };

  const paypalError = async (data: any) => {
    console.log("Operation error", data);
    setFailure("Payment failed! Please try again later!");
  };

  return (
    <div className="payment-container--backdrop">
      <div className="payment-container">
        <button
          className="payment-container-close btn btn-link"
          onClick={onDialogClose}
        >
          <IoMdClose />
        </button>
        <h2 className="text-2xl underline">Billing Information</h2>
        <div className="flex gap-4 items-start mt-4">
          <BsCartCheck />
          <div>
            <h4 className="text-xl">Order Number</h4>
            <strong className="text-2xl">{orderNumber}</strong>
          </div>
        </div>
        <div className="border-bottom h-2"></div>
        <div className="flex items-center gap-2">
          Amount:{" "}
          <strong>
            {currency} {(+orderTotal)?.toFixed(2)}
          </strong>
        </div>
        <div className="flex items-center gap-2">
          Delivery Charge:{" "}
          <strong>
            {currency} {(+totalDeliveryPrice)?.toFixed(2)}
          </strong>
        </div>
        {!!discount && (
          <div className="flex items-center gap-2">
            Discount:{" "}
            <strong>
              {currency} {(discount ?? 0)?.toFixed(2)}
            </strong>
          </div>
        )}
        <button
          className="btn btn-success btn-block mt-4 text-white text-lg"
          onClick={processPayment}
          disabled={showLoader}
        >
          {showLoader && <FiLoader size={24} className="animate-spin mr-2" />}
          Pay {currency}&nbsp;
          {+orderTotal + +totalDeliveryPrice - discount} / $
          {totalPriceDollar.toFixed(2)} with Credit Card / Debit Card / Amex
        </button>
        <button
          className="btn btn-success btn-block mt-4 text-white text-lg"
          onClick={processPayment}
          disabled={showLoader}
        >
          {showLoader && <FiLoader size={24} className="animate-spin mr-2" />}
          Pay {currency}&nbsp;
          {+orderTotal + +totalDeliveryPrice - discount} / $
          {totalPriceDollar.toFixed(2)} to Indonesian Bank Account
        </button>
        {options.clientId && (
          <div className="row">
            <div className="col-12">
              <PayPalScriptProvider options={options}>
                <PayPalButtons
                  style={{ color: "gold" }}
                  createOrder={async (_data, _actions) => {
                    let order_id = await paypalCreateOrder();
                    return order_id + "";
                  }}
                  onApprove={async (data, _actions) => {
                    let response = await paypalCaptureOrder(data?.orderID);
                    if (response) {
                      //todo
                    }
                  }}
                  onCancel={paypalCancelOrder}
                  onError={paypalError}
                  fundingSource={FUNDING.PAYPAL}
                ></PayPalButtons>
              </PayPalScriptProvider>
            </div>
          </div>
        )}
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
                Please do not hit back or forward button in browser or refresh
                the page.
              </strong>{" "}
              We'll notify you once payment has been processed. (This session
              will expire in {timer} sec)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentPopup
