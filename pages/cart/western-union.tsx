import React, { useEffect, useState } from 'react'
import Layout from "../../layouts/Main";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
import { getExchageRateFromState } from '@utils/localstorage';
import {
  removeAllProduct, resetBillingDetails, resetBillingError, resetShippingDetails,
  resetShippingError, resetWorkingCart, setCurrentStep, setGeneratedCart
} from '../../store/reducers/cart';

function WesternUnion() {
  const { orderTotal, generatedOrderNumber, cartItems, discount } = useSelector(
    (store: RootState) => store.cart
  );
  const [_orderTotal, setOrderTotal] = useState(0);
  const currentRate = getExchageRateFromState();
  const dispatch = useDispatch();

  const clearCart = () => {
    // clear the cart items
    dispatch(removeAllProduct());
    dispatch(resetBillingDetails());
    dispatch(resetShippingDetails());
    dispatch(resetBillingError());
    dispatch(resetShippingError());
    dispatch(resetWorkingCart());
    dispatch(setGeneratedCart({ order: "", total: 0 }));
    dispatch(setCurrentStep("shopping-cart"));
  }

  useEffect(() => {
    let totalDeliveryPrice = 0;
    totalDeliveryPrice += cartItems.reduce((total: number, item: any) => {
      return total + item.delivery.price;
    }, 0);

    setOrderTotal(+orderTotal + totalDeliveryPrice - +(discount?.amount || 0));

    return () => {
      setOrderTotal(0);
      clearCart();
    };
  }, [setOrderTotal]);

  return (
    <Layout>
      <div className="container flex flex-col justify-center mt-4 border">
        <h2 className="mt-3">Order Payment</h2>
        <hr />
        <p>
          <strong>
            Thank you for using FlowersChamp. Your Order Number is{" "}
            {generatedOrderNumber}
          </strong>{" "}
          <br />
          You can pay $ {(_orderTotal / currentRate).toFixed(2)} at your nearest
          Western Union office to our agent in Indonesia: <br />
          Name : <strong>Syiffa Fadillah Arman</strong> <br />
          City :{" "}
          <strong>
            Jl. Permata Trias Blok A2, Cibitung, Bekasi, 17520
          </strong>{" "}
          <br />
          Phone no : <strong>+62 815 9005 178</strong> <br />
          <br />
          After transferring the money, kindly send us an email to
          <a
            href="mailto:admin@flowerschamp.com"
            className="ml-1 text-blue-600"
          >
            admin@flowerschamp.com
          </a>{" "}
          with the following details:
        </p>
        <ol className="pl-4">
          <b>
            <li>
              {" "}
              First name and last name of the sender (must match exactly with
              the transaction).
            </li>
            <li> Western Union Transaction number.</li>
            <li> Country and City of sender.</li>
            <li> Date money was sent.</li>
            <li>Exact amount sent.</li>
          </b>
        </ol>
        <p>
          Kindly note that only after we receive your Payment , your Order will
          be confirmed . <br />
          You will receive an Order Confirmation Mail from us after we receive
          your payment . <br />
          <br />
          With Regards <br />
          Team - FlowersChamp <br />
          Note: You can find the nearest location by logging into{" "}
          <a
            href="www.westernunion.com"
            className="text-blue-600"
            target="_blank"
          >
            www.westernunion.com
          </a>
          .
        </p>
      </div>
    </Layout>
  );
}

export default WesternUnion
