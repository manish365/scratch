import Breadcrumb from '@components/breadcrumb';
import { Loader, PaymentPopup } from '@components/shared';
import { clientGetApiService } from '@utils/client-api.service';
import { server } from '@utils/server';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Layout from "../../layouts/Main";

function DirectPayment() {
  const router = useRouter();
  const {email = '', code = ''} = router.query;
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [selctedOrder, setSelectedOrder] = useState({
    orderNumber: "",
    orderTotal: 0,
    totalDeliveryPrice: 0,
    discount: 0,
  });
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);

  const openPaymentContainer = async (od: any) => {
    setSelectedOrder({
      orderNumber: od.code,
      orderTotal: od.orderDetails?.totalAmount,
      totalDeliveryPrice: od.orderDetails?.deliveryCharge,
      discount: od.orderDetails?.discount?.amount || 0,
    });
    setShowPaymentPopup(true);
  };

  const closePaymentPopup = () => {
    setShowPaymentPopup(false);
  };

  const getDecodedString = (str: any) => {
    return Buffer.from(str, "base64").toString();
  }

  const getOrderDetails = async (email: string = "", orderId: string = "") => {
    if (!email) {
      setError("Please enter a valid email first");
      return;
    }
    if (!orderId?.trim()) {
      setError("Please enter a valid order code");
      return;
    }
    try {
      setLoading(true);
      const _code = Buffer.from(orderId, "base64").toString();
      const _email = Buffer.from(email, "base64").toString();
      const response = await clientGetApiService(
        `${server}/user-auth/orders/${_code}/${_email}`,
        {}
      );
      if (response?.success && response.order) {
        openPaymentContainer(response.order);
        setLoading(false);
      } else {
        setLoading(false);
        setError("Sorry! We are unable to fetch order details");
      }
    } catch (error) {
      setLoading(false);
      setError("Sorry! We are unable to fetch order details");
    }
  };

  useEffect(() => {
    return () => {
      setLoading(false);
      setError("");
    };
  }, [setError]);

  return (
    <Layout>
      <Breadcrumb pName={"Payment"} mainPath="Home" />
      <div className="flex w-full items-center justify-center">
        <div className="w-6/12 p-4 flex flex-col justify-center mt-4 border Instant-popup">
          {loading && <Loader showLabel={false} />}
          {error && (
            <span className="flex items-center w-full bg-red-300 text-error mb-4 px-4 py-2 gap-2">
              <strong>Error!</strong>
              {error}
            </span>
          )}
          <div className="flex flex-col w-full">
            <h2>Instant Payment</h2>
            <div>
              <strong>Order No</strong> {getDecodedString(code)}
            </div>
            <div>
              <strong>Email</strong> {getDecodedString(email)}
            </div>
            {code && (
              <button
                className="btn btn-outline-dark w-auto mt-4"
                onClick={() =>
                  getOrderDetails(email?.toString(), code?.toString())
                }
              >
                Pay Now
              </button>
            )}
          </div>
          {showPaymentPopup && (
            <PaymentPopup
              orderNumber={selctedOrder.orderNumber}
              orderTotal={selctedOrder.orderTotal}
              totalDeliveryPrice={selctedOrder.totalDeliveryPrice}
              discount={selctedOrder.discount}
              onClose={closePaymentPopup}
              email={getDecodedString(email)}
            />
          )}
        </div>
      </div>
    </Layout>
  );
}

export default DirectPayment;
