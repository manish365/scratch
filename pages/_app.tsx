import React, { Fragment, useState, useEffect, useRef } from 'react';
import Router, {useRouter} from 'next/router';
import type { AppProps } from 'next/app';
import { Session } from "next-auth";
import { SessionProvider, getSession, signOut } from "next-auth/react";
import { clearProfile } from "store/reducers/user";
import { useDispatch } from 'react-redux';
import TagManager from "react-gtm-module";

import { wrapper } from '../store';
import { addTokenInterceptor } from '../utils/interceptor';
import { UserDataStorageService } from '../utils/services';
import SnackBarAlert from '../components/snackbar-alert';

// global styles
import '../assets/css/tailwind.css';
import '../assets/css/styles.scss';

import * as gtag from './../utils/gtag';

import AuthGuard from "../components/guard/auth-guard";

// React-Select Custom Scss
import '../assets/css/components/_custom-select.scss';
import { GA_TRACKING_ID } from './../utils/gtag';

// add requireAuth to AppProps
type AppPropsWithAuth = AppProps<{ session: Session }> & { Component: { auth?: boolean } };

const isProduction = process.env.NODE_ENV === 'production';
// only events on production
if (isProduction) {
  // Notice how we track pageview when route is changed
  Router.events.on('routeChangeComplete', (url: string) => gtag.pageview(url));
}

const MyApp = ({ Component, pageProps }: AppPropsWithAuth) => {
  const [_loading, setLoading] = useState(false);
  const [sessionData, setSessiondata] = useState<any>(null);
  const dispatch = useDispatch();
  const snackbarRef = useRef<SnackBarAlert | null>(null);
  const handleLogout = async () => {
    await signOut(); // Use the NextAuth signOut function
    await UserDataStorageService.clearUserData(); // clear session storage for user Data
    await dispatch(clearProfile());
    window.location.href = '/'; // Redirect to the desired page
  };

  const router = useRouter();

  useEffect(() => {
    const getSessionData = async () => {
      try {
        setLoading(true);
        const data: any = await getSession();
        setSessiondata(data);
        setLoading(false)
        // console.log('getSessionData===>>>>>>>>', data);
        // console.log('sessionData==>>>>>', sessionData);
        const expiresTimestamp = data?.expires;
        // console.log('Expires data===>>>', expiresTimestamp);
        // const dateObject = new Date(expiresTimestamp);
        // console.log('dateObject====>>>', dateObject.toString());

        const expirationTime: any = expiresTimestamp ? new Date(expiresTimestamp).getTime() : null;
        // console.log('expirationTime===>>>', expirationTime);

        if (expiresTimestamp !== null && !isNaN(expirationTime)) {
          const currentTime = new Date().getTime();
          // console.log('currentTime===>>>', currentTime);
          const timeUntilExpiration = expirationTime - currentTime;
          // console.log('timeUntilExpiration===>>>', timeUntilExpiration);
          if (timeUntilExpiration > 0) {

            setTimeout(async () => {
              await handleLogout();
            }, timeUntilExpiration);
          }
        } else {
          console.error('Invalid expiresTimestamp:', expiresTimestamp);
        }

        // if (!data) {
        //     await UserDataStorageService.clearUserData(); // clear session storage for user Data
        //     await dispatch(clearProfile());
        //     return;
        // }

        if (data?.user?.accessToken) {
          addTokenInterceptor(data?.user?.accessToken);
        }
      } catch (err: any) {
        // console.error(err);
        return {
          hasError: true,
          message: `Error ${err}`,
        };
      } finally {
        setLoading(false);
      }
    };

    setTimeout(() => {
      getSessionData();
    },);
    // Assign the reference to the instance
    snackbarRef.current = SnackBarAlert.instance;
  }, [dispatch]);

  useEffect(() => {
    const tagManagerArgs = {
      gtmId: GA_TRACKING_ID || "GTM-PDQ2832V",
    };
    TagManager.initialize(tagManagerArgs);
  }, []);

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({ event: "pageview", page: url });
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router?.events]);

  return (
    <Fragment>
      <SnackBarAlert ref={snackbarRef} /> {/* Pass the ref to the component */}

      <SessionProvider session={pageProps.session}>
        {Component.auth ? (
          <AuthGuard pageProps={sessionData}>
            <Component {...pageProps} snackbarRef={snackbarRef} />
          </AuthGuard>
        ) : (
          <Component {...pageProps} snackbarRef={snackbarRef} />
        )}
      </SessionProvider>
    </Fragment>
  )

};
// AuthInterceptor();

export default wrapper.withRedux(MyApp);