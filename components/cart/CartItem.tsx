import React, { useEffect } from "react";
import { BsCartFill, BsFillBagFill } from "react-icons/bs";
import CartItemQtyUpdate from "./CartItemQtyUpdate";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { ProductStoreType } from "~types/index";
import useDefaultCurrency from "@hooks/useDefaultCurrency";
import { setProductGiftOption, setProductGiftOptionError } from "../../store/reducers/cart";
import AddonItem from "./AddonItem";
import { useRouter } from "next/router";
interface PropType {
  item: ProductStoreType;
  index: number;
}

function CartItem({ item, index }: PropType) {
  const { metaData } = useSelector((store: RootState) => store.cart);
  const dispatch = useDispatch();
  const [currency] = useDefaultCurrency();
  const router = useRouter();

  const updateSelectedMsg = (value: string) => {
    if (value !== "other") {
      const _msg = metaData?.messageCards?.filter((m) => m.name === value)[0];
      dispatch(setProductGiftOption({ index, key: "messageType", value }));
      dispatch(
        setProductGiftOptionError({ index, key: "messageType", value: false })
      );

      dispatch(
        setProductGiftOption({ index, key: "message", value: _msg.text })
      );
      dispatch(
        setProductGiftOptionError({ index, key: "message", value: false })
      );
    } else {
      dispatch(setProductGiftOption({ index, key: "messageType", value }));
      dispatch(
        setProductGiftOptionError({ index, key: "messageType", value: false })
      );
    }
  };

  const updateGiftOptionMessage = (value: string) => {
    if (value?.trim()) {
      dispatch(
        setProductGiftOption({ index, key: "message", value })
      );
      dispatch(
        setProductGiftOptionError({ index, key: "message", value: false })
      );
    } else {
      dispatch(setProductGiftOption({ index, key: "message", value: "" }));
      dispatch(
        setProductGiftOptionError({ index, key: "message", value: true })
      );
    }
  }

  const onOccUpdate = (value: string) => {
    if (value) {
      dispatch(setProductGiftOption({ index, key: "occaision", value }));
      dispatch(setProductGiftOptionError({ index, key: "occaision", value: false }));
    }
  }

  const onSenderUpdate = (value: string) => {
    if (value) {
      dispatch(setProductGiftOption({ index, key: "senderName", value }));
      dispatch(setProductGiftOptionError({ index, key: "senderName", value: false }));
    } else {
      dispatch(setProductGiftOption({ index, key: "senderName", value: "" }));
    }
  }

  const onContinueShop = () => {
    router.push("/list/category/flowers");
  }

  const calculateAddonPrice = (item: ProductStoreType) => {
    let addOnPrice = 0;
    if (!item?.addOns?.length) {
      return 0
    }
    addOnPrice = item?.addOns.reduce((sum: number, addon) => {
      return sum + +addon.qty * +addon.unitPrice;
    }, 0)
    return addOnPrice;
  }

  useEffect(() => {
    updateSelectedMsg("other");
    onOccUpdate("No Occassion");
  }, []);

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex justify-between">
        <div className="flex items-center gap-2 border-b-2">
          <BsCartFill />
          <span>Cart {index + 1}</span>
        </div>
        <button
          className="btn btn-continue-shopp flex items-center gap-2"
          onClick={onContinueShop}
        >
          <BsFillBagFill />
          <span>Continue Shopping</span>
        </button>
      </div>
      <div className="flex p-4 shadow flex-col w-full gap-2">
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <div className="flex flex-col gap-2">
              <img
                src={item?.thumb}
                alt={item?.name}
                style={{ height: "134px", width: "160px" }}
              />
              <span>Code: #{item?.code}</span>
            </div>
            <div>
              <p>{item?.name}</p>
              <ul className="list-style-type-disc ml-4">
                <li>
                  <span className="text-capital">{item?.variant}</span> :{" "}
                  {currency} {item?.variantPrice?.toFixed(2) ?? "0"}
                </li>
                {item?.glassVaseAdded && (
                  <li>
                    Glass In Vase : {currency}{" "}
                    {(+item?.glassVasePrice || 0)?.toFixed(2)}
                  </li>
                )}
                {item?.eggLess && (
                  <li>
                    Eggless : {currency}{" "}
                    {(+item?.eggLessPrice || 0)?.toFixed(2)}
                  </li>
                )}
                <li>Delivery Type: {item?.delivery.time?.type}</li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col justify-center gap-4">
            <div className="flex items-center gap-4">
              <strong>Total:</strong>
              {currency}{" "}
              {(
                ((item?.eggLess ? +item?.eggLessPrice : 0) +
                  (item?.glassVaseAdded ? +item?.glassVasePrice : 0) +
                  +item?.variantPrice) *
                +item?.qty
              )?.toFixed(2)}
            </div>
            <CartItemQtyUpdate index={index} />
          </div>
        </div>
        {!!item.addOns?.length && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center product-addon-header">
              Product Addons
            </div>
            {item.addOns.map((addon, index1) => (
              <AddonItem
                addon={addon}
                key={addon._id}
                index={index1}
                cartIndex={index}
              />
            ))}
          </div>
        )}
        <div className="row">
          <div className="col-md-4 bold">
            <strong>Delivery Date:</strong>{" "}
            {new Date(item.delivery.date).toLocaleDateString("en-Us", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          <div className="col-md-4 bold">
            <strong>Delivery Time:</strong> {item.delivery.time.from} Hrs -{" "}
            {item.delivery.time.to} Hrs
          </div>
          <div className="col-md-4 bold">
            <strong>Delivery Charges:</strong> {currency}{" "}
            {item?.delivery?.price?.toFixed(2)}
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 flex flex-col gap-2">
            <select
              name="message-type"
              className="border form-control appear-auto"
              onChange={($e) => updateSelectedMsg($e.target.value)}
              value={item?.giftOption?.messageType}
            >
              <option value="other">Choose an Predefine Message</option>
              {metaData?.messageCards?.map((mc) => (
                <option value={mc.name} key={mc.name}>
                  {mc.name}
                </option>
              ))}
            </select>
            <textarea
              className={`w-full form-control border ${
                item.giftOption?.errors?.message ? "border-rose-500" : ""
              }`}
              rows={4}
              value={item.giftOption?.message}
              onChange={($e) => updateGiftOptionMessage($e.target.value)}
            ></textarea>
          </div>
          <div className="col-md-6 pl-4 flex gap-2 flex-col">
            <select
              className={`border form-control appear-auto ${
                item.giftOption?.errors?.occaision ? "border-rose-500" : ""
              }`}
              onChange={($e) => onOccUpdate($e.target.value)}
              value={item.giftOption?.occaision}
            >
              <option value="No Occassion">No Occassion</option>
              {metaData?.occaision?.map((mc) => (
                <option value={mc.name} key={mc._id}>
                  {mc.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              className={`form-control border ${
                item.giftOption?.errors?.senderName ? "border-rose-500" : ""
              }`}
              placeholder="Sender Name"
              onChange={($e) => onSenderUpdate($e.target.value)}
              value={item.giftOption?.senderName}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end items-center bold">
        <span>
          Subtotal ({+item?.qty} item(s)): {currency}{" "}
          {(
            (+item?.delivery?.price +
              (item?.eggLess ? +item?.eggLessPrice : 0) +
              (item?.glassVaseAdded ? +item?.glassVasePrice : 0) +
              +item?.variantPrice) *
              +item?.qty +
            calculateAddonPrice(item)
          )?.toFixed(2)}
        </span>
      </div>
    </div>
  );
}

export default CartItem;
