import { useState } from "react";

function useGetLocalStorage(key: string = "") {
  const [store, setStore] = useState<any>(null);
  if (typeof window !== "undefined" && window.localStorage && key.trim()) {
    const data = localStorage.getItem(key);
    if (data) {
      setStore(JSON.parse(data));
    }
  }
  return store;
}

function useSetLocalStorage(key: string = "", value: any): boolean {
  const [success, setSuccess] = useState<boolean>(false);
  if (typeof window !== "undefined" && window.localStorage && key?.trim()) {
    localStorage.setItem(key, JSON.stringify(value));
    setSuccess(true);
  }
  return success;
}

function useDeleteLocalStorage(key: string = "") {
  const [success, setSuccess] = useState(false);
  if (typeof window !== "undefined" && window.localStorage && key?.trim()) {
    localStorage.removeItem(key);
    setSuccess(true);
  }
  return success;
}

export { useGetLocalStorage, useSetLocalStorage, useDeleteLocalStorage };
