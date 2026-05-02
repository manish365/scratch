const dev = process.env.NEXT_PUBLIC_NODE_ENV !== "production";
export const backendURL = process.env.NEXT_PUBLIC_BACK_END_URL;

export const server = dev ? "https://flowerschamp-service-prod.up.railway.app" : backendURL;
