import { useEffect, useState } from "react";
import Layout from "../../layouts/Dashboard";
import { server } from "@utils/server";
import { clientGetApiService } from "@utils/client-api.service";
import useDefaultCurrency from "@hooks/useDefaultCurrency";
import { getExchageRateFromState } from "@utils/localstorage";
import { PaymentPopup } from "@components/shared";
import { useRouter } from "next/router";

const OrderHistory = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [currency] = useDefaultCurrency();
  const currentRate = getExchageRateFromState();
  const [selctedOrder, setSelectedOrder] = useState({ orderNumber: "", orderTotal: 0, totalDeliveryPrice: 0, discount: 0 });
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);

  const getAllOrder = async () => {
    try {
      const allOrders = await clientGetApiService(
        `${server}/user-auth/orders`,
        {}
      );
      if (allOrders?.success) {
        setOrders(allOrders.orders);
      }
    } catch (error) {
      // do something
    }
  }

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
  }

  const gotoTrackOrderPage = (orderCode: string) => {
    router.push(`/order-tracking?code=${orderCode}`);
  }

  const gotoOrderReviewPage = (orderCode: string) => {
    router.push(`/order-review?code=${orderCode}`);
  }

  useEffect(() => {
    getAllOrder();
  }, []);

  return (
    <Layout title="Order History | FlowersChamp">
      <div className="pl-3 ml-2">
        <h1 className="text-2xl mt-4">Order History page</h1>
        <div className="flex flex-col w-11/12">
          {orders && (
            <table className="all-order-table" border={1}>
              <thead>
                <tr>
                  <th className="px-2">Order Id</th>
                  <th>Delivery Date</th>
                  <th>Receiver's Details</th>
                  <th>Amount</th>
                  <th>Product Details</th>
                  <th>Order Status</th>
                </tr>
              </thead>
              <tbody>
                {!orders.length && <div>No orders available.</div>}
                {orders.map((od: any) => (
                  <tr key={od.code}>
                    <td>{od.code}</td>
                    <td>{od.delivery?.date || "-"}</td>
                    <td>
                      <strong className="uppercase">
                        {od.receiverInfo?.name}
                      </strong>
                      <br />
                      {od.receiverInfo?.address}
                      <br />
                      {od.receiverInfo?.mobile?.prefix}{" "}
                      {od.receiverInfo?.mobile?.number}
                      <br />
                      {od.receiverInfo?.email}
                    </td>
                    <td>
                      Product Total: {currency} {od.orderDetails?.totalAmount} /
                      ${" "}
                      {(od.orderDetails?.totalAmount / currentRate).toFixed(2)}
                      <br />
                      Delivery: {currency} &nbsp;
                      {(+od.orderDetails?.deliveryCharge || 0).toFixed(2)}
                      <br />
                      {od.orderDetails?.discount?.code && (
                        <>
                          Discount: {currency}{" "}
                          {od.orderDetails?.discount?.amount}(
                          {od.orderDetails?.discount?.percent}%)
                        </>
                      )}
                    </td>
                    <td>
                      {od.products.map((pr: any) => (
                        <div key={pr.name}>
                          {pr.name} <br />
                          <p>Options - {pr.variant}</p>
                          <p>Qty - {pr.qty}</p>
                        </div>
                      ))}
                    </td>
                    <td
                      className={
                        od.orderDetails?.status === "PAYMENTRECEIVED"
                          ? "text-green-700"
                          : od.orderDetails?.status === "NEW" ||
                            od.orderDetails?.status === "DELETED"
                          ? "text-red-600"
                          : ""
                      }
                    >
                      {od.orderDetails?.status === "NEW"
                        ? "Payment Due"
                        : od.orderDetails?.status}
                      <br />
                      {od.orderDetails?.status === "NEW" && (
                        <button
                          className="btn btn-outline-dark mt-2"
                          onClick={() => openPaymentContainer(od)}
                        >
                          Pay Now
                        </button>
                      )}

                      {!["DELIVERED", "NEW"].includes(
                        od.orderDetails?.status
                      ) && (
                        <button
                          className="btn btn-outline-dark mt-2"
                          onClick={() => gotoTrackOrderPage(od.code)}
                        >
                          Track Order
                        </button>
                      )}
                      {["DELIVERED"].includes(od.orderDetails?.status) && (
                        <button
                          className="btn btn-outline-dark my-2"
                          onClick={() => gotoOrderReviewPage(od.code)}
                        >
                          Review
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
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
    </Layout>
  );
};

OrderHistory.auth = true;
export default OrderHistory;
