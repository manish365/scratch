import React, { useEffect, useState } from "react";

import Layout from "../../layouts/Dashboard";
import OrderItem from "../../components/profile/OrderItem";
import { clientGetApiService } from "@utils/client-api.service";
import { server } from "@utils/server";

function Orders() {
  const [orders, setOrders] = useState<any[]>([]);

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
  };

  useEffect(() => {
    getAllOrder();
  }, []);

  return (
    <Layout title="Order History | FlowersChamp">
      <div className="pl-3 ml-2 flex flex-column">
        <h1 className="text-2xl mt-4">Your Orders</h1>
        <span>14 orders</span>
        <div className="flex flex-col w-full">
          {orders.map((order) => (
            <OrderItem key={order.code} order={order} />
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default Orders;
