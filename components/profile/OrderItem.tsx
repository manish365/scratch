import { PaymentPopup } from "@components/shared";
import useDefaultCurrency from "@hooks/useDefaultCurrency";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { OrderProductType } from "~types/General";


interface PropTypes {
  order: any;
}

function OrderItem({ order }: PropTypes) {
  const router = useRouter();
  const [currency] = useDefaultCurrency();
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

  const gotoTrackOrderPage = (orderCode: string) => {
    router.push(`/order-tracking?code=${orderCode}`);
  };

  const gotoOrderReviewPage = (orderCode: string) => {
    router.push(`/order-review?code=${orderCode}`);
  };

  return (
    <div className="flex flex-col border rounded w-10/12 mt-4">
      <div className="flex justify-between items-center border-b-2 w-full bg-light px-3 py-2">
        <div className="flex gap-4">
          <div className="flex flex-col">
            <span className="text-sm">ORDER PLACED</span>
            <span className="text-sm">
              {new Date(order?.createdAt)?.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm">TOTAL</span>
            <span className="text-sm">
              {currency}
              {order?.orderDetails?.totalAmount}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm">SHIP TO</span>
            <span className="text-sm">{order?.receiverInfo?.address}</span>
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <span className="text-sm text-black bold">ORDER # {order?.code}</span>
          {false && (
            <div className="flex items-center gap-4">
              <button className="btn-link text-blue-600 px-1 py-1">
                View order details
              </button>
              <button className="btn-link text-blue-600 px-1 py-1">
                Invoice
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex w-full justify-between items-center px-3 py-2">
        <div className="flex flex-column gap-4">
          {["DELIVERED"].includes(order?.orderDetails?.status) && (
            <div className="flex flex-col text-black">
              <span className="text-lg bold">
                Delivered on {order?.delivery?.date}
              </span>
              {order?.delivery?.receivedBy && (
                <span className="text-sm">
                  Package received by {order?.delivery?.receivedBy}
                </span>
              )}
              {!order?.delivery?.receivedBy && (
                <span className="text-sm">Package was handed to resident</span>
              )}
            </div>
          )}
          {order.orderDetails?.status === "NEW" && (
            <div className="flex flex-col text-red-600">
              <span className="text-lg bold">Payment Due</span>
              <span className="text-sm">
                Your Payment is due. Please pay now to avoid order deletion.
              </span>
            </div>
          )}
          {order.orderDetails?.status === "DELETED" && (
            <div className="flex flex-col text-red-600">
              <span className="text-lg bold">Order Deleted</span>
              <span className="text-sm">
                Order is deleted due to failed payment
              </span>
            </div>
          )}
          {order.products.map((p: OrderProductType) => (
            <div key={p._id} className="flex w-full gap-4">
              <div>
                <img
                  src={p.image}
                  alt={p.name}
                  style={{ width: "90px", height: "auto" }}
                />
              </div>
              <div className="flex flex-col grow">
                <span>{p.name}</span>
                <span className="w-96 truncate">{p.description}</span>
                <span>Variant: {p.variant}</span>
                {p.glassVaseAdded && (
                  <span className="text-blue-600">Glass Vase Added</span>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-column justify-center gap-2">
          {order.orderDetails?.status === "NEW" && (
            <button
              className="btn btn-outline-dark mt-2"
              onClick={() => openPaymentContainer(order)}
            >
              Pay Now
            </button>
          )}
          {!["DELIVERED", "NEW"].includes(order.orderDetails?.status) && (
            <button
              className="btn btn-outline-dark mt-2"
              onClick={() => gotoTrackOrderPage(order.code)}
            >
              Track Order
            </button>
          )}
          {["DELIVERED"].includes(order.orderDetails?.status) && (
            <button
              className="btn btn-outline-dark my-2"
              onClick={() => gotoOrderReviewPage(order.code)}
            >
              Write Product Review
            </button>
          )}
        </div>
      </div>
      <div className="flex w-full border-t-2 px-3 py-2">
        <button className="btn btn-link">Archive order</button>
      </div>
      {showPaymentPopup && (
        <PaymentPopup
          orderNumber={selctedOrder.orderNumber}
          orderTotal={selctedOrder.orderTotal}
          totalDeliveryPrice={selctedOrder.totalDeliveryPrice}
          discount={selctedOrder.discount}
          onClose={closePaymentPopup}
        />
      )}
    </div>
  );
}

export default OrderItem;
