import React, { useState } from 'react'
import LineItem from './LineItem';
import Link from 'next/link';
import {IoBagCheckOutline} from 'react-icons/io5'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
import { ProductStoreType } from '~types/index';
import useDefaultCurrency from '@hooks/useDefaultCurrency';
import {
  clearCartError, resetBillingError, resetShippingError, setCartCreateError, setCurrentStep,
  setGeneratedCart, setUserIp, updateCartError
} from '../../store/reducers/cart';
import { validateBillingDetails, validateShippingDetails } from "@utils/validation/validate-cart.service";
import { server } from '@utils/server';
import { Loader } from '@components/shared';

function OrderReview() {
  const {
    cartItems, shippingDetails, billingDetails, userIp, discount
  } = useSelector((store: RootState) => store.cart);
  const { user, profile } = useSelector((store: RootState) => store.user);
  const [loading, setLoading] = useState(false);
  const [currency] = useDefaultCurrency();
  const dispatch = useDispatch();
  const [tcCheck, setTcCheck] = useState<boolean>(false);
  const amount = cartItems?.reduce((sum: number, ct: ProductStoreType) => {
    sum += ct.qty * +ct.variantPrice;
    if (ct.eggLess) {
      sum += +ct.eggLessPrice
    }
    if (ct.glassVaseAdded) {
      sum += +ct.glassVasePrice
    }
    const addonPrice = ct?.addOns?.reduce((sum: number, addon) => {
      return sum + +addon.qty * +addon.unitPrice;
    }, 0);
    sum += addonPrice;

    return sum
  }, 0);
  const shipping = cartItems?.reduce((sum: number, ct: ProductStoreType) => {
    sum += ct.qty * ct.delivery.price;
    return sum;
  }, 0);

  const gotoPayment = () => {
    // clear existing errors
    dispatch(resetBillingError());
    dispatch(resetShippingError());

    // validate the shipping details
    const isValidateSD = validateShippingDetails(shippingDetails);
    if (!isValidateSD[0]) {
      console.log("invalid shipping details", isValidateSD);
      dispatch(
        updateCartError({
          store: "shippingDetails",
          key: isValidateSD[1],
          value: isValidateSD[2],
        })
      );
      return;
    }
    // clear the shipping validations errors if any
    dispatch(clearCartError({ store: "shippingDetails" }));

    // validate the billing details
    const isValidateBD = validateBillingDetails(billingDetails);
    if (!isValidateBD[0]) {
      console.log("invalid billing details", isValidateBD);
      dispatch(
        updateCartError({
          store: "billingDetails",
          key: isValidateBD[1],
          value: isValidateBD[2],
        })
      );
      return;
    }

    // clear the billing validations errors if any
    dispatch(clearCartError({ store: "billingDetails" }));

    // call server to create a order and update the invoice
    createCart()
  }

  const Timeout = (time: number = 8) => {
    let controller = new AbortController();
    setTimeout(() => controller.abort(), time * 1000);
    return controller;
  }

  const setIp = async () => {
    try {
      setLoading(true);
      const ipRes = await fetch(`https://api.ipify.org/?format=json`, {
        signal: Timeout(10).signal,
      });
      const ip = await ipRes.json();
      if (ip?.ip) dispatch(setUserIp(ip.ip));
    } catch (error) {
      // silently fail this call
      console.error('Failed to fetch details');
    } finally {
      setLoading(false);
    }
  }

  const createCart = async () => {
    await setIp();
    try {
      setLoading(true);
      const response = await fetch(`${server}/add-to-cart`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          email: user?.email || profile?.email?.address,
          cartItems,
          shippingDetails,
          billingDetails,
          ip: userIp,
          discount,
          createdFrom: 'web',
        }),
      });
      const res = await response.json();
      if (res?.success) {
        // go to the payment tab
        dispatch(setCartCreateError(""));
        dispatch(
          setGeneratedCart({ order: res.orderNumber, total: res.cartTotal })
        );
        dispatch(setCurrentStep("payment"));
      } else {
        dispatch(setCartCreateError("We are unable to create cart at this moment. Please try again later!"));
      }
    } catch (error: any) {
      dispatch(
        setCartCreateError(
          "Sorry! Unable to create cart. Please try again later!"
        )
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-column w-full p-4 gap-4 shadow">
      <div className="text-2xl bg-dark text-white items-center justify-content-center text-center">
        Order Review
      </div>
      {cartItems.map((cartItem, index) => (
        <div className="flex flex-col gap-4" key={cartItem.id}>
          <div className="uppercase bg-dark text-white flex items-center justify-center w-content px-4 py-2">
            Cart {index + 1}
          </div>
          <div className="w-full flex flex-column gap-4">
            <LineItem item={cartItem} />
            {cartItem?.addOns?.map((adn) => (
              <div className="flex items-center gap-4" key={adn._id}>
                <div className="flex items-center justify-center w-3/12">
                  <img
                    src={adn.image}
                    alt={adn.name}
                    style={{ width: "80px", height: "80px" }}
                  />
                </div>
                <div className="grow flex flex-column gap-4">
                  <span>{adn.name}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex w-full gap-4">
            <div>
              <strong>Delivery Date:</strong>{" "}
              {new Date(cartItem.delivery.date).toLocaleDateString("en-Us", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div>
              <strong>Delivery Time:</strong> {cartItem.delivery.time.from} Hrs
              - {cartItem.delivery.time.to} Hrs
            </div>
          </div>
        </div>
      ))}

      <div className="w-full bg-dark h-2"></div>
      <div className="flex justify-between items-center">
        <span>Amount:</span>
        <span>
          {currency} {amount?.toFixed(2)}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span>Shipping:</span>
        <span>
          {currency} {shipping?.toFixed(2)}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span>Discount:</span>
        <span>
          {currency} {(discount?.amount || 0).toFixed(2)}
        </span>
      </div>
      <div className="flex justify-between items-center bold">
        <span>Total:</span>
        <span>
          {currency} {(amount + shipping - (discount?.amount || 0))?.toFixed(2)}
        </span>
      </div>
      <div className="flex gap-4 cursor-pointer items-center">
        <input
          type="checkbox"
          className="appear-auto"
          id="tc-check"
          checked={tcCheck}
          onChange={() => setTcCheck(!tcCheck)}
        />
        <label htmlFor="tc-check" className="text-sm mb-0">
          I Accept The{" "}
          <Link href={"/cms/terms-and-conditions"} target="_blank">
            Terms & Conditions
          </Link>{" "}
          and{" "}
          <Link href={"/cms/privacy-policy"} target="_blank">
            Privacy Policy
          </Link>
        </label>
      </div>
      <div className="flex justify-center">
        <button
          className="btn btn-outline-dark flex gap-4 justify-center items-center"
          disabled={!tcCheck}
          onClick={gotoPayment}
        >
          {loading && (
            <Loader showLabel={false} width="w-auto" height="h-auto" />
          )}
          {!loading && <IoBagCheckOutline />} Proceed to Payment
        </button>
      </div>
    </div>
  );
}

export default OrderReview
