export const loadState = (key: string) => {
  try {
    const serializedState = localStorage.getItem(key);
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

export const saveState = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    // do nothing
  }
};

export const getExchageRateFromState = () => {
  try {
    const serializedState = localStorage.getItem("exchangeRateIDR");
    if (serializedState === null) {
      return 15544.784898;
    }
    return JSON.parse(serializedState)?.rate;
  } catch (err) {
    return 15544.784898;
  }
};

export type CMSDataKey = "cms-footer" | "cms-footer-page" | "menu";
export const getCMSDataWithTimer = (key: CMSDataKey) => {
  // console.log("[SDH] fetching cms data for", key);
  try {
    const serializedState = localStorage.getItem(key);
    if (serializedState === null) {
      return undefined;
    }
    const parsedData = JSON.parse(serializedState);
    const currentTimeStamp = +new Date();
    if (parsedData.expiresOn >= currentTimeStamp) {
      return parsedData.data;
    } else {
      localStorage.removeItem(key);
      return undefined;
    }
  } catch (err) {
    return undefined;
  }
};
export const saveCMSDataWithTimer = (
  key: CMSDataKey,
  value: any,
  expiresAfter: number = 60000
) => {
  // console.log('[SDH] storing cms data for', key);
  const currentTimeStamp = +new Date();
  try {
    localStorage.setItem(
      key,
      JSON.stringify({
        data: value,
        time: currentTimeStamp,
        expiresOn: currentTimeStamp + expiresAfter,
      })
    );
  } catch (err) {
    // do nothing
  }
};
