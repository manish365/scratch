import React, { useState, useEffect } from "react";
import Layout from "../../layouts/Main";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { signIn, useSession } from "next-auth/react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/router";
import SnackBarAlert from "components/snackbar-alert";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { clearUser } from "store/reducers/user";

type LoginPayLoad = {
  email: string;
  password: string;
};

const LoginPage = ({
  snackbarRef,
}: {
  snackbarRef: React.RefObject<SnackBarAlert | null>;
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [togglePassword, setTogglePassword] = useState(false);
  const [patchValueData, setPatchValueData] = useState<any>(null);
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<any>({
    mode: "onTouched",
  });
  const { status: sessionStatus } = useSession();
  const authorized = sessionStatus === "authenticated";
  const unAuthorized = sessionStatus === "unauthenticated";
  const loadings = sessionStatus === "loading";
  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const [callbackURL, setCallbackURL] = useState<string>('');
  // console.log('user===>>>>', user);
  // console.log("=====================", router.query);

  useEffect(() => {
    // check if the session is loading or the router is not ready
    if (loadings || !router.isReady) return;

    // if the user is not authorized, redirect to the login page
    // with a return url to the current page
    if (authorized) {
      console.log("authorized");
      window.location.href = "/dashboard";
    }
    if (user?.status === "ACTIVE") {
      setPatchValueData(user);
    }
  }, [loadings, authorized, sessionStatus, router, user]);

  useEffect(() => {
    if (patchValueData) {
      patchFieldValue(patchValueData);
    }
  }, [patchValueData, setValue]);

  useEffect(() => {
    if (router.query && router.query?.url) {
      setCallbackURL(router.query.url as string);
    } else {
      setCallbackURL("/dashboard");
    }
  }, [])

  async function patchFieldValue(parsedData: any) {
    // console.log("parsedData patchFieldValue===>>>", parsedData);
    if (parsedData?.status === "ACTIVE") {
      // console.log('Entering-----------------------');
      setValue("email", parsedData?.email);
    }
  }

  // if the user refreshed the page or somehow navigated to the protected page
  if (loadings) {
    return <>Loading app...</>;
  }

  const onSubmit = async (data: LoginPayLoad) => {
    // console.log('Request Data PayLoad===>>>', data);
    try {
      setLoading(true);
      const signInResponse = await signIn("credentials", {
        username: data.email,
        password: data.password,
        redirect: false,
        callbackUrl: callbackURL,
      });

      setTimeout(() => setLoading(false), 1500);
      // console.log('API Response==>>>', signInResponse);

      if (!signInResponse?.ok) {
        // console.log('NextAuthContext.tsx login()---', signInResponse?.error);
        if (signInResponse?.error == "CredentialsSignin") {
          snackbarRef.current?.showSnackBar(`Email or Password is Invalid !!`);
        } else {
          snackbarRef.current?.showSnackBar(
            `API call failed !!, Error: ${signInResponse?.error}`
          );
        }
        return {
          hasError: true,
          message: `Error for SignIn Response: ${signInResponse?.error}`,
        };
      } else {
        reset();
        await dispatch(clearUser());
        snackbarRef.current?.showSnackBar("Login successful !!");
        router.push(callbackURL);
      }
      return { hasError: true, message: "Error In Try Block !!" };
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
  };
  const loginWithFacebook = () => {
    console.log("loginWithFb Button Clicked");
  };
  const loginWithGoogle = () => {
    console.log("loginWithGoogle Button Clicked");
  };

  return unAuthorized ? (
    <Layout title="Login | FlowersChamp">
      <section className="form-page">
        {loading && (
          <div
            className="container"
            style={{ background: "#3B5998", color: "white" }}
          >
            Please wait while we load the page.....
          </div>
        )}
        <div className="container">
          <div className="back-button-section">
            <Link href="/">
              <i className="icon-left"></i> Back
            </Link>
          </div>

          <div className="form-block">
            <h2 className="form-block__title">Log in</h2>
            <form className="form" onSubmit={handleSubmit(onSubmit)}>
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
              </div>

              <div className="form__input-row">
                <input
                  className="form__input"
                  type={togglePassword ? "text" : "password"}
                  placeholder="Password"
                  {...register("password", { required: true })}
                />
                <div className="d-flex flex-wrap align-items-center justify-content-start">
                  <i
                    id={togglePassword ? "passlock" : "showpass"}
                    onClick={() => {
                      setTogglePassword(!togglePassword);
                    }}
                  >
                    {togglePassword ? <FaEye /> : <FaEyeSlash />}
                  </i>
                </div>

                {errors.password && errors.password.type === "required" && (
                  <p className="message message--error">
                    Password is required.
                  </p>
                )}
              </div>

              <div className="form__info">
                <div className="checkbox-wrapper">
                  <label
                    htmlFor="check-signed-in"
                    className={`checkbox checkbox--sm`}
                  >
                    <input
                      type="checkbox"
                      id="check-signed-in"
                      {...register("keepSigned", { required: false })}
                    />
                    <span className="checkbox__check"></span>
                    <p>Keep me signed in</p>
                  </label>
                </div>
                <a
                  href="/auth/forgot-password"
                  className="form__info__forgot-password"
                >
                  Forgot password?
                </a>
              </div>

              <div className="form__btns">
                <button
                  type="button"
                  className="btn-social fb-btn"
                  onClick={loginWithFacebook}
                >
                  <i className="icon-facebook"></i>Facebook
                </button>
                <button
                  type="button"
                  className="btn-social google-btn"
                  onClick={loginWithGoogle}
                >
                  <img src="/images/icons/gmail.svg" alt="gmail" /> Gmail
                </button>
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
                  "Sign In"
                )}
              </button>

              <p className="form__signup-link">
                Not a member yet? <Link href="/auth/register">Sign up</Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  ) : (
    <></>
  );
};

export default LoginPage;
