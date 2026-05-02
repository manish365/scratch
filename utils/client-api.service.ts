import { getTokenInterceptor } from './interceptor';

/** Client API Calls Starts */
// Common POST Service
export const clientPostApiService = async (url: string, data: any, options?: RequestInit) => {
    // console.log('api url===>>', url);
    // console.log('getTokenInterceptor(options)===>>>>>>>>>>>>>>', { ...getTokenInterceptor(options) });

    const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        ...getTokenInterceptor(options),
        body: JSON.stringify(data),
    });
    return response.json();
}
export const clientPostApiServiceWithoutContentType = async (url: string, data: any, options?: RequestInit) => {
    // console.log('api url===>>', url);
    // console.log('getTokenInterceptor(options)===>>>>>>>>>>>>>>', { ...getTokenInterceptor(options) });

    const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        ...getTokenInterceptor(options),
        body: JSON.stringify(data),
    });
    return response.json();
}

// Common GET Service
export const clientGetApiService = async (url: string, _data: any, options?: RequestInit) => {
    // console.log('api url===>>', url);
    // console.log('getTokenInterceptor(options)===>>>>>>>>>>>>>>', { ...getTokenInterceptor(options) });
    // AuthInterceptor();

    const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        ...getTokenInterceptor(options)
    });
    return response.json();
}

// Common PUT Service
export const clientPutApiService = async (url: string, data: any, options?: RequestInit) => {
    // console.log('api url===>>', url);
    // console.log('getTokenInterceptor(options)===>>>>>>>>>>>>>>', { ...getTokenInterceptor(options) });

    const response = await fetch(url, {
        method: 'PUT',
        mode: 'cors',
        ...getTokenInterceptor(options),
        // headers: {
        //   Accept: 'application/json',
        //   'Content-Type' : 'application/json; charset=utf-8',
        // },
        body: JSON.stringify(data),
    });
    return response.json();
}

// Common PATCH Service
export const clientPatchApiService = async (url: string, data: any, options?: RequestInit) => {
    // console.log('api url===>>', url);
    // console.log('getTokenInterceptor(options)===>>>>>>>>>>>>>>', { ...getTokenInterceptor(options) });

    const response = await fetch(url, {
        method: 'PATCH',
        mode: 'cors',
        ...getTokenInterceptor(options),
        body: JSON.stringify(data),
    });
    return response.json();
}

// Common DELETE Service
export const clientDeleteApiService = async (url: string, data: any, options?: RequestInit) => {
    // console.log('api url===>>', url);
    // console.log('getTokenInterceptor(options)===>>>>>>>>>>>>>>', { ...getTokenInterceptor(options) });

    const response = await fetch(url, {
        method: 'DELETE',
        mode: 'cors',
        ...getTokenInterceptor(options),
        body: JSON.stringify(data),
    });
    return response.json();
}
/** Client API Calls Ends */
