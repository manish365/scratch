import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import useDefaultCurrency from "@hooks/useDefaultCurrency";
import { ProductStoreType } from "~types/index";
import { getExchageRateFromState } from "@utils/localstorage";
import { MdOutlineClear } from "react-icons/md";
import { clientPostApiService } from "@utils/client-api.service";
import { server } from "@utils/server";
import { Loader } from "@components/shared";
import { useSession } from "next-auth/react";
import { resetCartDiscount, setCartDiscount } from "../../store/reducers/cart";
import CartSummaryItem from "./CartSummaryItem";

function CartSummary() {
  const dispatch = useDispatch();
  const { data: session, status } = useSession();
  const { cartItems }: any = useSelector((state: RootState) => state.cart);
  const [currency] = useDefaultCurrency();
  const [promo, setPromo] = useState<string>("");
  const [promoError, setPromoError] = useState<string>("");
  const [promoObj, setPromoObj] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalDiscount, setTotalDiscount] = useState<number>(0);
  const [totalCartAmount, setTotalCartAmount] = useState<number>(0);
  const [totalCartAfterDiscountAmount, setTotalCartAfterDiscountAmount] =
    useState<number>(0);

  const currentRate = getExchageRateFromState();

  const onChangePromoCode = (e: any) => {
    setPromo(e?.target?.value);
    if (e?.key === "Enter") {
      validatePromoCode(e?.target?.value);
    }
  };

  const validatePromoCode = async (promo: string) => {
    if (!promo) {
      setPromoError("Enter coupon first!");
      return;
    }
    setPromoError("");
    console.log("triggering search with", promo);
    try {
      setLoading(true);
      const selectedPromo = await clientPostApiService(
        `${server}/user-auth/apply-coupon`,
        { coupon: promo }
      );
      if (selectedPromo?.success) {
        setPromoObj(selectedPromo.promo);
        setTotalDiscount(
          (totalCartAmount * +selectedPromo.promo?.discount) / 100
        );
        dispatch(
          setCartDiscount({
            amount: (totalCartAmount * +selectedPromo.promo?.discount) / 100,
            code: selectedPromo.promo?.code,
            percent: +selectedPromo.promo?.discount,
          })
        );
      } else {
        setPromoObj(null);
        setPromoError("Invalid coupon code!");
      }
    } catch (error) {
      setPromoObj(null);
      setPromoError("Invalid coupon code!");
      dispatch(resetCartDiscount());
    } finally {
      setLoading(false);
    }
  };

  const removePromo = () => {
    setPromoError("");
    dispatch(resetCartDiscount());
  };

  const clearAppliedPromo = () => {
    setTotalDiscount(0);
    setPromoObj(null);
    setPromo("");
    dispatch(resetCartDiscount());
  };

  useEffect(() => {
    let totalCartPrice = 0;
    let totalDelivery = 0;
    cartItems.forEach((item: any) => {
      const itemPrice =
        ((item?.eggLess ? +item?.eggLessPrice : 0) +
          (item?.glassVaseAdded ? +item?.glassVasePrice : 0) +
          +item?.variantPrice) *
        +item?.qty;
      let itemAddOnPrice = 0;
      if (item?.addOns?.length) {
        itemAddOnPrice = item?.addOns?.reduce((sum: number, addon: any) => {
          return sum + +addon.qty * +addon.unitPrice;
        }, 0);
      }
      totalCartPrice += itemPrice + itemAddOnPrice;
      totalDelivery += item.delivery?.price || 0;
    });
    setTotalCartAmount(totalCartPrice);
    setTotalCartAfterDiscountAmount(
      totalCartPrice - totalDiscount + totalDelivery
    );

    return () => {
      setTotalCartAmount(0);
      setTotalCartAfterDiscountAmount(0);
    };
  }, [cartItems, setTotalCartAmount, totalDiscount]);

  return (
    <div className="flex flex-col gap-2 w-full shadow px-3 py-3">
      <h2>Order Summary</h2>
      {
        cartItems?.map((item: ProductStoreType, index: number) => 
          <CartSummaryItem index={index} item={item} key={item.id} />
        )
      }
      <div className="flex w-full justify-between items-center">
        <span className="bold">Delivery Charges</span>
        <span className="total-price">
          {currency}{" "}
          {cartItems
            ?.reduce((total: number, item: any) => {
              return total + item.delivery.price;
            }, 0)
            ?.toFixed(2)}
        </span>
      </div>
      {session?.user && status === "authenticated" && (
        <div className="flex w-full justify-between items-center">
          <span className="bold">Discount Code:</span>
          <span className="right-code">
            <input
              type="text"
              placeholder="Enter Coupon Code"
              className="form-control"
              onKeyDown={($e) => onChangePromoCode($e)}
              onChange={($e) => onChangePromoCode($e)}
              value={promo}
            />
          </span>
        </div>
      )}
      {promoError && (
        <div className="flex w-full justify-end items-center">
          <span className="right-code text-red-600 flex items-center">
            <strong className="mr-2">Error!</strong> {promoError}
            <button className="btn btn-link" onClick={removePromo}>
              <MdOutlineClear />
            </button>
          </span>
        </div>
      )}
      {promoObj && (
        <div className="flex w-full justify-end items-center">
          <div className="right-code text-green-600 flex items-start">
            <p className="mb-0">
              <strong className="mr-2">Success!</strong> {promoObj?.code}{" "}
              applied successfully. You'll get {promoObj?.discount}% off on this
              order.
            </p>
            <button className="btn btn-link" onClick={clearAppliedPromo}>
              <MdOutlineClear />
            </button>
          </div>
        </div>
      )}
      <div></div>
      {session?.user && status === "authenticated" && (
        <div className="flex w-full justify-end items-center">
          <button
            className="btn btn-outline-dark w-auto flex gap-2 items-center"
            onClick={() => validatePromoCode(promo)}
          >
            {loading && <Loader showLabel={false} width="w-auto" />}
            Apply
          </button>
        </div>
      )}

      {promoObj && (
        <div className="flex w-full justify-between items-center cart-total mt-4">
          <span className="bold text-md">{promoObj?.discount}% Discount</span>
          <span className="total-price bold text-black">
            {currency} {totalDiscount?.toFixed(2)} / ${" "}
            {(totalDiscount / currentRate).toFixed(2)}
          </span>
        </div>
      )}
      <div className="flex w-full justify-between items-center cart-total">
        <span className="bold text-md">Total</span>
        <span className="total-price bold text-black">
          {currency} {totalCartAfterDiscountAmount?.toFixed(2)} / ${" "}
          {(totalCartAfterDiscountAmount / currentRate).toFixed(2)}
        </span>
      </div>
    </div>
  );
}

export default CartSummary;
