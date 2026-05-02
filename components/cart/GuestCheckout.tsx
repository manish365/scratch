import React, { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { BiLogoGoogle } from 'react-icons/bi'
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "store/reducers/user";
import { RootState } from "store";
import {
  removeProductGiftOptionError,
  setCurrentStep,
  setProductGiftOptionError
} from "../../store/reducers/cart";
import { AiFillForward } from "react-icons/ai";

function GuestCheckout() {
  const dispatch = useDispatch();
  const { profile, user } = useSelector((state: RootState) => state.user);
  const { cartItems } = useSelector((state: RootState) => state.cart);

  const { data: session, status } = useSession();
  const [errEmailField, setErrEmailField] = useState<boolean>(false);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [email, setEmail] = useState<string>('');

  const redirectToCheckout = () => {
    // validate gift options
    let isError = false;
    cartItems.forEach((ci, cIndex: number) => {
      if (!ci.giftOption) {
        isError = true;
      } else {
        const { message, messageType, occaision, senderName } = ci.giftOption;
        if (!message || !messageType || !occaision || !senderName) {
          if (!message) {
            dispatch(
              setProductGiftOptionError({ index: cIndex, key: "message", value: true })
            );
          }
          if (!messageType) {
            dispatch(
              setProductGiftOptionError({ index: cIndex, key: "messageType", value: true })
            );
          }
          if (!occaision) {
            dispatch(
              setProductGiftOptionError({ index: cIndex, key: "occaision", value: true })
            );
          }
          if (!senderName) {
            dispatch(
              setProductGiftOptionError({ index: cIndex, key: "senderName", value: true })
            );
          }
          isError = true;
        } else {
          dispatch(removeProductGiftOptionError({ index: cIndex }));
        }
      }
    });

    if (isError) {
      // validation failed! no need to go further
      return;
    }

    if (status === 'authenticated' || user?.status === 'ACTIVE') {
      dispatch(setCurrentStep("order-form"));
    } else  {
      setErrEmailField(true);
    }
  }
  const handleInputChange = (event: any) => {
    const inputValue = event.target.value;
    console.log(inputValue);
    setEmail(inputValue);

    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    console.log(emailRegex.test(inputValue));
    setIsValidEmail(emailRegex.test(inputValue));

    if(emailRegex.test(inputValue)) {
      const updatedProfile: any = {
          name: '',
          email: inputValue,
          status: 'ACTIVE'
        };
        // console.log(updatedProfile);
        // update the store
        dispatch(setUser({...updatedProfile}));
    }
  }

  useEffect(() => {
    if (!email) {
      // setErrEmailField(true);
    } else {
      setErrEmailField(false);
    }
  }, [email, errEmailField, user, profile])
  

  return (
    <div className="flex items-center flex-col gap-4 shadow p-4 w-full">
      {!session?.user && status !== "authenticated" && (
        <>
          <input
            id="email"
            type="email"
            className={`form-control${errEmailField ? " error" : ""}`}
            placeholder="Enter email id"
            onChange={handleInputChange}
            value={email}
            required
          />

          {(errEmailField || !isValidEmail) && (
            <p className="text-red-600">Please enter a valid email address!</p>
          )}
        </>
      )}
      <button
        className="btn btn-outline-dark checkout-btn"
        onClick={redirectToCheckout}
      >
        Checkout
        <AiFillForward fontSize={20} />
      </button>
      {!session?.user && status !== "authenticated" && (
        <>
          <span>or Login with</span>
          <div className="flex w-auto gap-4 items-center">
            <button className="btn btn-outline-danger flex items-center gap-2 justify-center">
              <BiLogoGoogle /> Google
            </button>
            <button className="btn btn-outline-dark" onClick={() => signIn()}>
              Login to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default GuestCheckout;
