import React, { useEffect, useState } from 'react';
import { IoMdClose, IoIosAddCircleOutline } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { toggleAddonModal, updateWorkingCart } from 'store/reducers/cart';
import { FaRegCircleCheck } from "react-icons/fa6";
import { LuPlus, LuMinus } from "react-icons/lu";
import useDefaultCurrency from '@hooks/useDefaultCurrency';
import useDefaultAddon from "@hooks/useDefaultAddon";
import { RootState } from 'store';
import { getExchageRateFromState } from "@utils/localstorage";
import { server } from '@utils/server';

interface PropTypes {
  addProductToCart: any;
  product: any;
}

function AddonModal({ product, addProductToCart }: PropTypes) {
  const dispatch = useDispatch();
  const [addOns, setAddOns] = useState<any>({});
  const [addOnList, setAddOnList] = useState<any[]>([]);
  const [totalAddOns, setTotalAddOns] = useState<number>(0);
  const [totalAddOnsPrice, setTotalAddOnsPrice] = useState<number>(0);
  const [currency, secondaryCurrency] = useDefaultCurrency();
  const { workingCart } = useSelector((state: RootState) => state.cart);
  const defaultAddonList = useDefaultAddon();
  const currentRate = getExchageRateFromState();

  const onClose = () => {
    setAddOns([]);
    setTotalAddOns(0);
    setTotalAddOnsPrice(0);
    dispatch(toggleAddonModal());
  };

  const updateAddOnList = (pid: string) => {
    if (!pid) {
      return;
    }
    if (addOns[pid]) {
      // do nothing
    } else {
      const newAddOns = {
        ...addOns,
        [pid]: 1,
      };
      setAddOns(newAddOns);
      updateTotalAddOnQty(newAddOns);
    }
  };

  const decreaseAddOnQty = (pid: string) => {
    const newAddOns = { ...addOns };
    if (newAddOns[pid]) {
      if (newAddOns[pid] > 1) {
        newAddOns[pid] = newAddOns[pid] - 1;
      } else {
        delete newAddOns[pid];
      }
    }
    setAddOns(newAddOns);
    updateTotalAddOnQty(newAddOns);
  };

  const increaseAddOnQty = (pid: string) => {
    const newAddOns = { ...addOns };
    if (newAddOns[pid]) {
      newAddOns[pid] = newAddOns[pid] + 1;
    } else {
      newAddOns[pid] = 1;
    }
    setAddOns(newAddOns);
    updateTotalAddOnQty(newAddOns);
  };

  const updateTotalAddOnQty = (_addOns: any) => {
    let count = 0;
    let totalPrice = 0;
    const isAddonExist = product.related?.products?.length || false;

    Object.keys(_addOns).forEach((key) => {
      let pp = []
      if (isAddonExist) {
        pp = product?.related?.products.filter((p: any) => p._id === key);
      } else {
        pp = addOnList.filter((p: any) => p._id === key);
      }
      count += _addOns[key];
      totalPrice += +pp[0]?.price * _addOns[key];
    });
    setTotalAddOns(count);
    setTotalAddOnsPrice(totalPrice);
  };

  const onAddToCart = () => {
    const isAddonExist = product.related?.products?.length || false;
    const newAddOns: {
      _id: string; qty: any; unitPrice: number; image: string; name: string; code?: string;
    }[] = [];
    Object.keys(addOns).forEach((key) => {
      let pp = [];
      if (isAddonExist) {
        pp = product?.related?.products.filter((p: any) => p._id === key);
      } else {
        pp = addOnList.filter((p: any) => p._id === key);
      }
      newAddOns.push({
        _id: key,
        qty: addOns[key],
        unitPrice: +pp[0].price,
        image: pp[0].image,
        name: pp[0].name,
        code: pp[0].code,
      });
    });
    dispatch(
      updateWorkingCart({
        addOns: newAddOns,
        addOnQty: totalAddOns,
        addOnPrice: totalAddOnsPrice,
      })
    );

    addProductToCart(newAddOns);
    onClose();
  };

  useEffect(() => {
    async function fetchAddons() { 
      try {
        const res = await fetch(`${server}/addon-product`);
        const data = await res.json();
        if (data?.success) {
          setAddOnList(data.results);
        } else {
          setAddOnList(defaultAddonList);
        }
      } catch (error) {
        setAddOnList(defaultAddonList);
      }
    }
    fetchAddons();
  }, [])

  return (
    <div className="addon-modal--wrapper">
      <div className="addon-modal">
        <div className="addon-modal-close" onClick={onClose}>
          <IoMdClose />
        </div>
        <div className="addon-modal-content">
          {product?.related?.products.map((p: any) => (
            <div
              key={p._id}
              className={
                addOns[p._id]
                  ? `addon-modal-box addon-modal-box-checked`
                  : `addon-modal-box`
              }
              onClick={() => updateAddOnList(p._id)}
            >
              <div className="addon-modal-box-check-mark">
                {addOns[p._id] && <FaRegCircleCheck size={20} />}
                {!addOns[p._id] && <IoIosAddCircleOutline size={22} />}
              </div>
              <div className="addon-modal-box-image">
                <img src={p.image} alt={p.name} width={"100%"} />
              </div>
              <h4>{p.name}</h4>
              <span className="addon-modal-box-price">
                {currency} {(+p.price).toFixed(2)} / {secondaryCurrency}{" "}
                {(+p.price / +currentRate)?.toFixed(2)}
              </span>
              {!addOns[p._id] && (
                <button className="btn btn-outline-dark">Add</button>
              )}
              {addOns[p._id] && (
                <div className="flex items-center justify-between">
                  <button
                    className="btn btn-outline-dark"
                    onClick={() => decreaseAddOnQty(p._id)}
                  >
                    <LuMinus />
                  </button>
                  {addOns[p._id]}
                  <button
                    className="btn btn-outline-dark"
                    onClick={() => increaseAddOnQty(p._id)}
                    disabled={addOns[p._id] >= 10}
                  >
                    <LuPlus />
                  </button>
                </div>
              )}
            </div>
          ))}
          {!product?.related?.products?.length && (
            <>
              {addOnList.map((p: any) => (
                <div
                  key={p._id}
                  className={
                    addOns[p._id]
                      ? `addon-modal-box addon-modal-box-checked`
                      : `addon-modal-box`
                  }
                  onClick={() => updateAddOnList(p._id)}
                >
                  <div className="addon-modal-box-check-mark">
                    {addOns[p._id] && <FaRegCircleCheck size={20} />}
                    {!addOns[p._id] && <IoIosAddCircleOutline size={22} />}
                  </div>
                  <div className="addon-modal-box-image">
                    <img src={p.image} alt={p.name} width={"100%"} />
                  </div>
                  <h4>{p.name}</h4>
                  <span className="addon-modal-box-price">
                    {currency} {(+p.price).toFixed(2)} / {secondaryCurrency}{" "}
                    {(+p.price / +currentRate)?.toFixed(2)}
                  </span>
                  {!addOns[p._id] && (
                    <button className="btn btn-outline-dark">Add</button>
                  )}
                  {addOns[p._id] && (
                    <div className="flex items-center justify-between">
                      <button
                        className="btn btn-outline-dark"
                        onClick={() => decreaseAddOnQty(p._id)}
                      >
                        <LuMinus />
                      </button>
                      {addOns[p._id]}
                      <button
                        className="btn btn-outline-dark"
                        onClick={() => increaseAddOnQty(p._id)}
                        disabled={addOns[p._id] >= 10}
                      >
                        <LuPlus />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
        <div className="addon-modal-footer">
          <div className="addon-modal-footer-content">
            <h4>Price Details</h4>
            <div>
              1 Base Item {currency} {workingCart?.price?.toFixed(2)} /{" "}
              {secondaryCurrency}{" "}
              {(+workingCart?.price / +currentRate)?.toFixed(2)}
            </div>
            <span>+</span>
            <div>
              {totalAddOns} Add-ons {currency} {totalAddOnsPrice?.toFixed(2)} /{" "}
              {secondaryCurrency}{" "}
              {(+totalAddOnsPrice / +currentRate)?.toFixed(2)}
            </div>
            <span>=</span>
            <div className="addon-modal-footer-content-total-price">
              Total {currency}{" "}
              {(+workingCart?.price + totalAddOnsPrice)?.toFixed(2)} /{" "}
              {secondaryCurrency}{" "}
              {(
                (+workingCart?.price + +totalAddOnsPrice) /
                +currentRate
              )?.toFixed(2)}
            </div>
          </div>
          <button className="btn btn-outline-dark" onClick={onAddToCart}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddonModal;
