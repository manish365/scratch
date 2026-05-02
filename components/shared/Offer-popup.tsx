import React, { useState, useEffect } from "react";
import { FaTimesCircle, FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { server } from "../../utils/server";
import { clientPostApiService } from "../../utils/client-api.service";
import { useRouter } from "next/router";

type SignUpPayLoad = {
  fName: string;
  lName: string;
  email: string;
  mobile: string;
  birthday: {
    mm: string;
    dd: string;
  };
  password: string;
  confirmPassword: string;
};

// Standalone function
function handleOfferPopup(setIsOpen: any) {
  setIsOpen(true);
  sessionStorage.setItem("isOfferPopupClosed", "true");
}

const OfferPopup = () => {
  const { push } = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [toggle1, setTogglePassword] = useState(false);
  const [toggle2, setToggleConfirmPassword] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<SignUpPayLoad>({
    mode: "onTouched",
  });

  useEffect(() => {
    const isOfferPopupClosed = sessionStorage.getItem("isOfferPopupClosed");

    if (isOfferPopupClosed === "true") {
      setIsOpen(true);
    }
  }, []);

  const onSubmit = async (data: SignUpPayLoad) => {
    try {
      const res = await clientPostApiService(`${server}/user-auth/register`, {
        email: data.email,
        name: data.fName + " " + data.lName,
        mobile: data.mobile,
        password: data.confirmPassword,
      });

      if (!res?.success) {
        return {
          hasError: true,
          message: `Error for SignUp Response: ${res}`,
        };
      } else {
        reset();
        // snackbarRef.current?.showSnackBar('User Registration Successful.');
        push("/auth/login");
      }
      return { hasError: true, message: "Error In Try Block !!" };
    } catch (err: any) {
      // console.error(err);
      //   snackbarRef.current?.showSnackBar(`API call error !!, Error: ${err}`);
      return {
        hasError: true,
        message: `Error ${err}`,
      };
    }
  };

  return (
    <section
      id="offer-popup"
      className="flex-wrap align-items-center"
      style={{ display: isOpen ? "none" : "flex" }}
    >
      <div className="offer-popup-content">
        <div className="offer-popup-header">
          <div className="header-container">
            <button
              type="button"
              className="close d-flex align-items-center"
              aria-label="close"
              onClick={() => handleOfferPopup(setIsOpen)}
            >
              <FaTimesCircle />
            </button>
            <h1 className="d-flex flex-row align-items-center">
              Enjoy 10% Off On Your First Order
            </h1>
            <p className="d-flex flex-row align-items-center">
              Sign up to get special offers, updates, gift ideas, & more.
            </p>
          </div>
        </div>

        <div className="offer-popup-body">
          <div className="form-block">
            <form className="form" onSubmit={handleSubmit(onSubmit)}>
              <div className="content-formFields">
                <div className="form-fieldWrapper">
                  <label id="email">Email</label>
                  <input
                    aria-label="Enter Your Email Address"
                    type="text"
                    className={errors.email ? "invalid-error" : ""}
                    {...register("email", {
                      required: true,
                      pattern:
                        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    })}
                  />

                  {errors.email && errors.email.type === "required" && (
                    <p className="invalid-error-msg">Email is required.</p>
                  )}

                  {errors.email && errors.email.type === "pattern" && (
                    <p className="invalid-error-msg">
                      Please write a valid email.
                    </p>
                  )}
                </div>
                <div className="form-fieldWrapper">
                  <label id="fName">First Name</label>
                  <input
                    aria-label="First Name"
                    type="text"
                    className={errors.fName ? "invalid-error" : ""}
                    {...register("fName", { required: true })}
                  />

                  {errors.fName && errors.fName.type === "required" && (
                    <p className="invalid-error-msg">First Name is required.</p>
                  )}
                </div>
                <div className="form-fieldWrapper">
                  <label id="lName">Last Name</label>
                  <input
                    aria-label="Last Name"
                    type="text"
                    className={errors.lName ? "invalid-error" : ""}
                    {...register("lName", { required: true })}
                  />

                  {errors.lName && errors.lName.type === "required" && (
                    <p className="invalid-error-msg">Last Name is required.</p>
                  )}
                </div>
                <div className="form-fieldWrapper">
                  <label id="mobile">Phone Number</label>
                  <input
                    aria-label="Phone Number"
                    type="text"
                    className={errors.mobile ? "invalid-error" : ""}
                    {...register("mobile", {
                      required: true,
                      pattern:
                        /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
                      maxLength: 12,
                    })}
                  />

                  {errors.mobile && errors.mobile.type === "required" && (
                    <p className="invalid-error-msg">Phone No. is required.</p>
                  )}
                  {errors.mobile && errors.mobile.type === "pattern" && (
                    <p className="invalid-error-msg">
                      Please write a valid phone no.
                    </p>
                  )}
                  {errors.mobile && errors.mobile.type === "maxLength" && (
                    <p className="invalid-error-msg">
                      Phone No. cannot exceed more than 12 characters
                    </p>
                  )}
                </div>
                <div className="form-fieldWrapper">
                  <label id="password">Password</label>
                  <input
                    aria-label="Password"
                    type={toggle1 ? "text" : "password"}
                    className={errors.password ? "invalid-error" : ""}
                    {...register("password", { required: true })}
                  />
                  <div className="d-flex flex-wrap align-items-center justify-content-start">
                    <i
                      id={toggle1 ? "passlock" : "showpass"}
                      onClick={() => {
                        setTogglePassword(!toggle1);
                      }}
                    >
                      {toggle1 ? <FaEye /> : <FaEyeSlash />}
                    </i>
                  </div>

                  {errors.password && errors.password.type === "required" && (
                    <p className="invalid-error-msg">Password is required.</p>
                  )}
                </div>
                <div className="form-fieldWrapper">
                  <label id="cPass">Confirm Password</label>
                  <input
                    aria-label="Confirm Password"
                    type={toggle2 ? "text" : "password"}
                    className={errors.confirmPassword ? "invalid-error" : ""}
                    {...register("confirmPassword", {
                      required: true,
                      validate: (val: string) => {
                        if (watch("password") != val) {
                          return "Your passwords do no match";
                        }
                      },
                    })}
                  />
                  <div className="d-flex flex-wrap align-items-center justify-content-start">
                    <i
                      id={toggle2 ? "passlock" : "showpass"}
                      onClick={() => {
                        setToggleConfirmPassword(!toggle2);
                      }}
                    >
                      {toggle2 ? <FaEye /> : <FaEyeSlash />}
                    </i>
                  </div>

                  {errors.confirmPassword &&
                    errors.confirmPassword.type === "required" && (
                      <p className="invalid-error-msg">
                        Confirm Password is required.
                      </p>
                    )}
                  {errors.confirmPassword && errors.confirmPassword.message && (
                    <p className="invalid-error-msg">
                      {String(errors.confirmPassword.message)}
                    </p>
                  )}
                </div>
                <div className="form-fieldWrapper">
                  <label id="birthday">Birthday</label>
                  <div className="d-flex flex-wrap align-items-center">
                    <input
                      aria-label="Birthday Month"
                      className={
                        errors?.birthday?.mm ? "invalid-error mx-1" : "mx-1"
                      }
                      type="text"
                      placeholder="MM"
                      maxLength={2}
                      style={{ width: "45px" }}
                      {...register("birthday.mm", {
                        required: true,
                        pattern: /^[0-9]+$/,
                      })}
                    />
                    <input
                      aria-label="Day on Month"
                      className={
                        errors?.birthday?.dd ? "invalid-error mx-1" : "mx-1"
                      }
                      type="text"
                      placeholder="DD"
                      maxLength={2}
                      style={{ width: "45px" }}
                      {...register("birthday.dd", {
                        required: true,
                        pattern: /^[0-9]+$/,
                      })}
                    />

                    {(errors?.birthday?.mm || errors?.birthday?.dd) &&
                      (errors?.birthday?.mm?.type === "required" ||
                        errors?.birthday?.dd?.type === "required") && (
                        <p className="invalid-error-msg">
                          This field is required.
                        </p>
                      )}
                    {(errors?.birthday?.mm || errors?.birthday?.dd) &&
                      (errors?.birthday?.mm?.type === "pattern" ||
                        errors?.birthday?.dd?.type === "pattern") && (
                        <p className="invalid-error-msg">
                          Please enter only numbers.
                        </p>
                      )}
                  </div>
                  <div
                    className="help-text"
                    style={{
                      display:
                        errors?.birthday?.mm || errors?.birthday?.dd
                          ? "none"
                          : "block",
                    }}
                  >
                    <p>
                      These will only be used to send you personalized offers &
                      emails.
                    </p>
                  </div>
                </div>
              </div>
              <div className="content-footer">
                <div className="content_button">
                  <button type="submit">Subscribe</button>
                </div>
                <div className="content_footer-text">
                  <p>
                    By clicking subscribe you agree to receive marketing emails
                    from Flowers Champ.
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OfferPopup;
