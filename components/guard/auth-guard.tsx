import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { UserDataStorageService } from '../../utils/services';
import { useDispatch } from 'react-redux';
import { clearProfile } from 'store/reducers/user';

interface AuthGuardProps {
    children: React.ReactNode;
    pageProps?: any;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
    // console.log('AuthGuard==>>>', pageProps);
    const router = useRouter();
    const dispatch = useDispatch();
    const { status: sessionStatus } = useSession();
    const authorized = sessionStatus === 'authenticated';
    const unAuthorized = sessionStatus === 'unauthenticated';
    const loading = sessionStatus === 'loading';

    useEffect(() => {
        // check if the session is loading or the router is not ready
        if (loading || !router.isReady) return;

        // if the user is not authorized, redirect to the login page
        // with a return url to the current page
        if (unAuthorized) {
            console.log('not authorized');

            UserDataStorageService.clearUserData(); // clear session storage for user Data
            dispatch(clearProfile());
            router.push({
                pathname: '/',
                // query: { returnUrl: router.asPath },
            });
        }
    }, [loading, unAuthorized, sessionStatus, router]);

    // if the user refreshed the page or somehow navigated to the protected page
    if (loading) {
        return <>Loading app...</>;
    }
    // if the user is authorized, render the page
    // otherwise, render nothing while the router redirects him to the login page
    return authorized ? <div>{children}</div> : <></>;
};

export default AuthGuard;



