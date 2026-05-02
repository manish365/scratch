import React, { useState, useEffect } from 'react';
import Layout from '../../layouts/Main';
import Link from 'next/link';
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useSession } from 'next-auth/react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { server } from '../../utils/server';
import { clientPostApiService } from '../../utils/client-api.service';
import SnackBarAlert from 'components/snackbar-alert';

type SignUpPayLoad = {
  fName: string;
  lName: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

const RegisterPage = ({ snackbarRef }: { snackbarRef: React.RefObject<SnackBarAlert | null> }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [toggle1, setTogglePassword] = useState(false);
  const [toggle2, setToggleConfirmPassword] = useState(false);
  const { push } = useRouter();
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<any>({ mode: 'onTouched' });
  const { status: sessionStatus } = useSession();
  const authorized = sessionStatus === 'authenticated';
  const unAuthorized = sessionStatus === 'unauthenticated';
  const loadings = sessionStatus === 'loading';
  const [duplicateEmailError, setDuplicateEmailError] = useState(false);
  const [duplicateEmailErrorMsg, setDuplicateEmailErrorMsg] = useState<string>('');


  useEffect(() => {
    // check if the session is loading or the router is not ready
    if (loadings || !router.isReady) return;

    // if the user is not authorized, redirect to the login page
    // with a return url to the current page
    if (authorized) {
      console.log('authorized');
      router.push({
        pathname: '/',
      });
    }
  }, [loadings, authorized, sessionStatus, router]);

  // if the user refreshed the page or somehow navigated to the protected page
  if (loadings) {
    return <>Loading app...</>;
  }

  const onSubmit = async (data: SignUpPayLoad) => {
    console.log('Request Data PayLoad===>>>', data);
    try {
      setLoading(true);
      const res = await clientPostApiService(`${server}/user-auth/register`, {
        email: data.email,
        name: (data.fName + ' ' + data.lName),
        mobile: data.mobile,
        password: data.confirmPassword
      });

      setTimeout(() => setLoading(false), 1500);
      // console.log('API Response==>>>', res);
      if (!res?.success) {
        // console.log('Error in While submitting---', res);
        if(res?.error?.code?.toString() !== '11000') {
          snackbarRef.current?.showSnackBar(`API call failed !!, Error: ${res}`);
        }
        if(res?.error) {
          if(res?.error?.code?.toString() === '11000') {
            setDuplicateEmailError(true);
            setDuplicateEmailErrorMsg('Email already exists. Please add a new Email Id.');
          } else {
            setDuplicateEmailError(false);
            setDuplicateEmailErrorMsg('');
          }
        } 
        return {
          hasError: true,
          message: `Error for SignUp Response: ${res}`,
        };
      } else {
        reset();
        setDuplicateEmailErrorMsg('');
        setDuplicateEmailError(false);

        snackbarRef.current?.showSnackBar('User Registration Successful.');
        push('/auth/login');
      }
      return { hasError: true, message: 'Error In Try Block !!' }
    } catch (err: any) {
      // console.error(err);
      snackbarRef.current?.showSnackBar(`API call error !!, Error: ${err}`);
      return {
        hasError: true,
        message: `Error ${err}`,
      };
    } finally {
      setLoading(false);
    }
  }

  return unAuthorized ? (
    <Layout title="Register | FlowersChamp">
      <section className="form-page">
        <div className="container">
          <div className="back-button-section">
            <Link href="/auth/login">
              <i className="icon-left"></i> Back to Login
            </Link>
          </div>

          <div className="form-block">
            <h2 className="form-block__title">
              Create an account and discover the benefits
            </h2>

            <form className="form" onSubmit={handleSubmit(onSubmit)}>
              <div className="form__input-row">
                <input
                  className="form__input"
                  placeholder="First Name"
                  type="text"
                  {...register("fName", { required: true })}
                />

                {errors.fName && errors.fName.type === "required" && (
                  <p className="message message--error">
                    First Name is required.
                  </p>
                )}
              </div>

              <div className="form__input-row">
                <input
                  className="form__input"
                  placeholder="Last Name"
                  type="text"
                  {...register("lName", { required: true })}
                />

                {errors.lName && errors.lName.type === "required" && (
                  <p className="message message--error">
                    Last Name is required.
                  </p>
                )}
              </div>

              <div className="form__input-row">
                <input
                  className="form__input"
                  placeholder="Email"
                  type="text"
                  {...register("email", {
                    required: true,
                    pattern:
                      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  })}
                />

                {errors.email && errors.email.type === "required" && (
                  <p className="message message--error">Email is required.</p>
                )}
                {errors.email && errors.email.type === "pattern" && (
                  <p className="message message--error">
                    Please write a valid email.
                  </p>
                )}
                {(duplicateEmailError) ? (
                  <p className="message message--error">
                    {duplicateEmailErrorMsg}
                  </p>
                  ) :
                  (<></>)
                }
              </div>

              <div className="form__input-row">
                <input
                  className="form__input"
                  type="text"
                  placeholder="Mobile No."
                  {...register("mobile", {
                    required: true,
                    pattern:
                      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
                    maxLength: 12,
                  })}
                />

                {errors.mobile && errors.mobile.type === "required" && (
                  <p className="message message--error">
                    Mobile No. is required.
                  </p>
                )}
                {errors.mobile && errors.mobile.type === "pattern" && (
                  <p className="message message--error">
                    Please write a valid mobile no.
                  </p>
                )}
                {errors.mobile && errors.mobile.type === "maxLength" && (
                  <p className="message message--error">
                    Mobile No. cannot exceed more than 12 characters
                  </p>
                )}
              </div>

              <div className="form__input-row d-flex flex-wrap align-items-center justify-content-start">
                <input
                  className="form__input"
                  type={toggle1 ? "text" : "password"}
                  placeholder="Password"
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
                  <p className="message message--error">
                    Password is required.
                  </p>
                )}
              </div>

              <div className="form__input-row">
                <input
                  className="form__input"
                  type={toggle2 ? "text" : "password"}
                  placeholder="Confirm Password"
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
                    <p className="message message--error">
                      Confirm Password is required.
                    </p>
                  )}
                {errors.confirmPassword && errors.confirmPassword.message && (
                  <p className="message message--error">
                    {String(errors.confirmPassword.message)}
                  </p>
                )}
              </div>

              <div className="form__info">
                <div className="checkbox-wrapper">
                  <label
                    htmlFor="acceptTerms"
                    className={`checkbox checkbox--sm`}
                  >
                    <input
                      type="checkbox"
                      id="acceptTerms"
                      {...register("acceptTerms", { required: true })}
                    />
                    <span className="checkbox__check"></span>
                    <p>
                      I agree to the Google Terms of Service and Privacy Policy
                    </p>
                  </label>
                  {errors.acceptTerms &&
                    errors.acceptTerms.type === "required" && (
                      <p className="message message--error">
                        Privacy Policy is not checked.
                      </p>
                    )}
                </div>
              </div>

              <button
                type="submit"
                className={
                  loading
                    ? "btn btn--rounded btn--blue btn-submit"
                    : "btn btn--rounded btn--yellow btn-submit"
                }
                disabled={loading}
              >
                {loading ? (
                  <div
                    className="spinner-border text-light font-weight-bolder"
                    role="status"
                  >
                    <span className="sr-only font-weight-bolder">
                      Loading...
                    </span>
                  </div>
                ) : (
                  "Sign up"
                )}
              </button>

              <p className="form__signup-link">
                Are you already a member?
                <Link href="/auth/login">Go to Sign in</Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  ) : (
    <></>
  );
}

export default RegisterPage;
