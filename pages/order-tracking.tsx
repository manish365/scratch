import React, { useEffect, useState } from "react";
import Layout from "../layouts/Main";
import Breadcrumb from "@components/breadcrumb";
import { clientGetApiService } from "@utils/client-api.service";
import { server } from "@utils/server";
import { Loader } from "@components/shared";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { useRouter } from 'next/router';

function OrderTracking() {
  const [error, setError] = useState<string>("");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [orderNo, setOrderNo] = useState<string>("");
  const { profile } = useSelector((store: RootState) => store.user);
  const router = useRouter();
  const { code } = router.query;
  const metaDesc =
    "Our order tracking system ensures you stay updated with real-time notifications from dispatch to delivery, guaranteeing peace of mind.";
  const metaKeywords =
    "order tracking, flowers indonesia, flower delivery in indonesia, florist in indonesia, flowers champ";

  useEffect(() => {
    if(code) {
      setOrderNo(code?.toString());
    }
    if (profile?.email?.address) {
      setEmail(profile?.email?.address);
    }
    return () => {
      setOrder(null);
    };
  }, [setEmail, setOrder, setOrderNo]);

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
      const response = await clientGetApiService(
        `${server}/user-auth/orders/${orderId}/${email}`,
        {}
      );
      if (response?.success) {
        setOrder(response.order);
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

  const searchOrder = () => {
    setError("");
    getOrderDetails(email, orderNo);
  };

  const clearSelectedOrder = () => {
    setLoading(false);
    setError("");
    setOrder(null);
    setOrderNo("");
  };

  return (
    <Layout
      title="Track Your Order | FlowersChamp Indonesia"
      description={metaDesc}
      keywords={metaKeywords}
    >
      <Breadcrumb pName={"Track order"} mainPath="Home" />
      {loading && <Loader showLabel={false} />}
      <div className="container">
        {error && (
          <span className="flex items-center w-full bg-red-300 text-error mb-4 px-4 py-2 gap-2">
            <strong>Error!</strong>
            {error}
          </span>
        )}
        <div className="row items-center">
          <h2>Track Order</h2>
          <div className="w-full flex items-start">
            <div className="col-6 col-xs-12">
              <img
                src="https://www.probunga.com/assets/template/templateprobunga/image/track_order.webp"
                alt="Track Order"
              />
            </div>
            <div className="col-6 col-xs-12">
              {!order && (
                <div className="w-full flex flex-col">
                  <h2>Where is my order?</h2>
                  <div className="form-group">
                    <label>Order No:</label>
                    <input
                      type="text"
                      name="search"
                      placeholder="Order Number : FCIDXXX"
                      autoComplete="off"
                      className="form-control"
                      value={orderNo}
                      onChange={($e) => setOrderNo($e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Id:</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter Email Id"
                      autoComplete="off"
                      className="form-control"
                      value={email}
                      onChange={($e) => setEmail($e.target.value)}
                    />
                  </div>
                  <button
                    className="btn btn-outline-dark"
                    onClick={searchOrder}
                  >
                    Continue
                  </button>
                </div>
              )}
              {order && (
                <div className="w-full flex flex-col gap-4">
                  <div className="flex gap-4 items-center">
                    <span>Order Number:</span>
                    <strong>{order.code}</strong>
                  </div>
                  <div className="flex gap-4 items-center">
                    <span>Order Amount:</span>
                    <strong>{order.orderDetails?.totalAmount}</strong>
                  </div>
                  <div className="flex gap-4 items-center">
                    <span>Order Date:</span>
                    <strong>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </strong>
                  </div>
                  <div className="flex gap-4 items-center">
                    <span>Delivery Date:</span>
                    <strong>
                      {new Date(order.delivery?.date).toLocaleDateString()}
                    </strong>
                  </div>
                  <div className="flex gap-4 items-center">
                    <span>Payment Status:</span>
                    <strong
                      className={
                        order.orderDetails?.status === "PENDING" ||
                        order.orderDetails?.status === "DELETED"
                          ? "text-red-600"
                          : ""
                      }
                    >
                      {order.payment?.status === "PENDING"
                        ? "Due"
                        : order.payment?.status === "PAYMENTREFUND"
                        ? "Refunded"
                        : order.payment?.status}
                    </strong>
                  </div>
                  <div className="flex gap-4 items-center">
                    <span>Order Status:</span>
                    <strong
                      className={
                        order.orderDetails?.status === "PAYMENTRECEIVED" ||
                        order.orderDetails?.status === "NEW"
                          ? "text-blue-600"
                          : order.orderDetails?.status === "DELETED"
                          ? "text-red-600"
                          : ""
                      }
                    >
                      {order.orderDetails?.status === "NEW"
                        ? "Payment Due"
                        : order.orderDetails?.status === "PAYMENTRECEIVED"
                        ? "Pending"
                        : order.orderDetails?.status === "PENDING"
                        ? "In Process"
                        : order.orderDetails?.status === "DELIVERED"
                        ? "Delivered"
                        : order.orderDetails?.status}
                    </strong>
                  </div>
                  <button
                    className="btn btn-outline-dark mt-4"
                    onClick={clearSelectedOrder}
                  >
                    Track another order
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default OrderTracking;
