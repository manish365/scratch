import React, { useState, useEffect } from "react";
import { BsCartCheck } from "react-icons/bs";
import {
  PayPalScriptProvider,
  PayPalButtons,
  ReactPayPalScriptOptions,
  FUNDING,
} from "@paypal/react-paypal-js";
import { server } from "utils/server";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import useDefaultCurrency from "@hooks/useDefaultCurrency";
import { SnackBar } from "@components/shared";
import { useRouter } from "next/router";
import {
  removeAllProduct, resetBillingDetails, resetShippingDetails, setCurrentStep
} from "store/reducers/cart";
import XenditPaymentContainer from "./XenditPaymentContainer";
import { useSession } from "next-auth/react";

function PaymentContainer() {
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [snackBarConfig, setSnackBarConfig] = useState<any>({
    variant: "WARNING",
    btnText: "Close",
    message: "Something went wrong!",
  });
  const [totalDeliveryPrice, setTotalDeliveryPrice] = useState(0);
  const options: ReactPayPalScriptOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "",
    currency: "USD",
    intent: "capture",
  };
  // console.log("[PAYPAL] selected option", options);
  const { orderTotal, generatedOrderNumber, cartItems, discount, currentStep } = useSelector(
    (store: RootState) => store.cart
  );
  const { user } = useSelector((store: RootState) => store.user)
  const [currency] = useDefaultCurrency();
  const router = useRouter()
  const dispatch = useDispatch();
  const { data: session, status } = useSession();

  // console.log('session >>', session, status)

  useEffect(() => {
    let totalDeliveryPrice = 0;
    totalDeliveryPrice += cartItems.reduce(
      (total: number, item: any) => {
        return total + item.delivery.price;
      },
      0
    );
    setTotalDeliveryPrice(totalDeliveryPrice);

    // check if user email/session is active
    if (currentStep === "payment") {
      if (!session?.user && status === "unauthenticated") {
        // check if guest checkout
        if (!user?.email) {
          router.push("/auth/login?url=" + router.asPath);
          return;
        }
      }
    }

    return () => {
      setTotalDeliveryPrice(0);
    };
  }, [setTotalDeliveryPrice]);
  

  const paypalCreateOrder = async () => {
    try {
      const response = await fetch(`${server}/paypal/create-order`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          email: session?.user?.email || user?.email,
          orderPrice: orderTotal,
          order: generatedOrderNumber,
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
          orderCode: generatedOrderNumber,
          email: session?.user?.email || user?.email,
        }),
      });
      const res = await response.json();
      if (res?.success) {
        // remove products from store
        dispatch(removeAllProduct());
        dispatch(resetShippingDetails());
        dispatch(resetBillingDetails());
        dispatch(setCurrentStep("shopping-cart"));

        // Order is successful
        setSnackBarConfig({
          ...snackBarConfig,
          variant: "SUCCESS",
          message: "Payment successfull!",
        });
        setShowSnackBar(!showSnackBar);

        // goto success screen
        console.log("============ [success]", res);
        router.push("/cart/payment-success");
      } else {
        showErrorAlert();
      }
    } catch (err) {
      // Order is not successful
      console.log("============= [error]", err);
      showErrorAlert();
    }
  };

  const paypalCancelOrder = async (data: any, actions: any) => {
    console.log("Operation cancelled");
    console.log(data, actions);
    setSnackBarConfig({
      ...snackBarConfig,
      variant: "WARNING",
      message: "Payment cancelled! Please try again later!",
    });
    setShowSnackBar(!showSnackBar);
    setTimeout(() => {
      setShowSnackBar(!showSnackBar);
    }, 5000);
  };

  const paypalError = async (data: any) => {
    console.log("Operation error", data);
    showErrorAlert();
  };

  const onClickSnackBarAction = () => {
    setShowSnackBar(!showSnackBar);
  };

  const showErrorAlert = () => {
    setSnackBarConfig({
      ...snackBarConfig,
      variant: "FAILURE",
      message: "Payment failed! Please try again later!",
    });
    setShowSnackBar(!showSnackBar);
  };

  const gotoWesternUnionPage = () => {
    router.push('/cart/western-union');
  }

  return (
    <div className="row">
      <div className="col-md-4 flex flex-col gap-4 border shadow p-4 billing-detail-section">
        <h2 className="text-2xl underline">Billing Information</h2>
        <div className="flex gap-4 items-start mt-4">
          <BsCartCheck />
          <div>
            <h4 className="text-xl">Order Number</h4>
            <strong className="text-2xl">{generatedOrderNumber}</strong>
          </div>
        </div>
        <div className="border-bottom h-2"></div>
        <div className="flex items-center gap-2">
          Amount:{" "}
          <strong>
            {currency} {(orderTotal ?? 0)?.toFixed(2)}
          </strong>
        </div>
        <div className="flex items-center gap-2">
          Delivery Charge:{" "}
          <strong>
            {currency} {(totalDeliveryPrice ?? 0)?.toFixed(2)}
          </strong>
        </div>
        <div className="flex items-center gap-2">
          Discount:{" "}
          <strong>
            {currency} {(discount?.amount ?? 0)?.toFixed(2)}
          </strong>
        </div>
      </div>
      <div className="col-md-8">
        <div className="row">
          <div className="col-12">
            <XenditPaymentContainer />
          </div>
        </div>
        {options.clientId && (
          <div className="row mt-2">
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
        <div className="row">
          <div className="col-12 mt-4">
            <div className="flex w-11/12 flex-col">
              <p>
                Pay via <strong>Western Union</strong>
              </p>
              <button
                className="btn btn-outline-dark btn-lg btn-block"
                onClick={gotoWesternUnionPage}
              >
                Pay via Western Union
              </button>
            </div>
          </div>
        </div>
      </div>

      {showSnackBar && (
        <SnackBar
          message={snackBarConfig.message}
          variant={snackBarConfig.variant}
          action={onClickSnackBarAction}
        />
      )}
    </div>
  );
}

export default PaymentContainer;
