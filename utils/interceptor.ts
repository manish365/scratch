import { UserDataStorageService } from '../utils/services';

const addTokenInterceptor = (_token: string) => {
    getTokenInterceptor();
};
const getTokenInterceptor = (options?: RequestInit): RequestInit => {
    const TOKEN = UserDataStorageService.getUserData()?.user?.accessToken;

    const headers: any = {
        Accept: 'application/json',
        'Content-Type' : 'application/json; charset=utf-8',
        // Add other headers if needed
        ...(options?.headers || {}),
    };
    
    if (TOKEN) {
        headers.Authorization = `Bearer ${TOKEN}`;
    } else {
        console.error('Token is not set !!');
        // throw router.push('/');
    }

    return {
        ...options,
        headers,
    };
};

export { addTokenInterceptor, getTokenInterceptor };