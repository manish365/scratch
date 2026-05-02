import React, { useState, useEffect } from 'react';
import Layout from '../../layouts/Main';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { server } from '../../utils/server';
import { clientPostApiService } from '../../utils/client-api.service';
import SnackBarAlert from 'components/snackbar-alert';

type ForgotPasswordPayLoad = {
  email: string;
}

const ForgotPassword = ({ snackbarRef }: { snackbarRef: React.RefObject<SnackBarAlert | null> }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { push } = useRouter();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<any>({ mode: 'onTouched' });
  const { status: sessionStatus } = useSession();
  const authorized = sessionStatus === 'authenticated';
  const unAuthorized = sessionStatus === 'unauthenticated';
  const loadings = sessionStatus === 'loading';

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


  const onSubmit = async (data: ForgotPasswordPayLoad) => {
    console.log('Request Data PayLoad===>>>', data);
    try {
      setLoading(true);
      const res = await clientPostApiService(`${server}/user-auth/reset-password`, {
        email: data.email,
      });

      setTimeout(() => setLoading(false), 1500);
      console.log('API Response==>>>', res);
      if (!res?.success) {
        console.log('Error in While submitting---', res);
        snackbarRef.current?.showSnackBar(`API call failed !!, Error: ${res}`);
        return {
          hasError: true,
          message: `Error for Reset Password Response: ${res}`,
        };
      } else {
        reset();
        snackbarRef.current?.showSnackBar('Password Reset Successful. Please check your mail.');
        push('/auth/login');
      }
      return { hasError: true, message: 'Error In Try Block !!' }
    } catch (err: any) {
      console.error(err);
      snackbarRef.current?.showSnackBar(`API call error !!, Error: ${err}`);
      return {
        hasError: true,
        message: `Error ${err}`,
      };
    } finally {
      setLoading(false);
    }
  };

  return unAuthorized ? (
    <Layout>
      <section className="form-page">
        <div className="container">
          <div className="back-button-section">
            <Link href="/auth/login">
              <i className="icon-left"></i> Back to Login
            </Link>
          </div>

          <div className="form-block">
            <h2 className="form-block__title">Forgot your password?</h2>
            <p className="form-block__description">Enter your email or phone number and recover your account</p>

            <form className="form" onSubmit={handleSubmit(onSubmit)}>
              <div className="form__input-row">
                <input
                  className="form__input"
                  placeholder="Email"
                  type="text"
                  {...register("email", {
                    required: true,
                    pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  })}
                />

                {errors.email && errors.email.type === 'required' &&
                  <p className="message message--error">Email is required.</p>
                }

                {errors.email && errors.email.type === 'pattern' &&
                  <p className="message message--error">Please write a valid email.</p>
                }
              </div>

              {/* <div className="form__input-row">
                <input 
                  className="form__input" 
                  type="password" 
                  placeholder="Password" 
                  name="password"
                  ref={register({ required: true })}
                />
                {errors.password && errors.password.type === 'required' && 
                  <p className="message message--error">Password is required.</p>
                }
              </div> */}

              <button type="submit" className={(loading) ? "btn btn--rounded btn--blue btn-submit" : "btn btn--rounded btn--yellow btn-submit"} disabled={loading}>
                {loading ? (
                  <div className="spinner-border text-light font-weight-bolder" role="status">
                    <span className="sr-only font-weight-bolder">Loading...</span>
                  </div>
                ) : 'Submit'}
              </button>
            </form>
          </div>

        </div>
      </section>
    </Layout>
  ) : (<></>)
}

export default ForgotPassword;