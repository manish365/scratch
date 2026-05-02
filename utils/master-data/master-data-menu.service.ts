import { server } from "../server";
import { masterDataGetApiService } from "../master-data-api.service";

const getMenuDetails = async () => {
  try {
    const res = await masterDataGetApiService(`${server}/menu`, {});
    if (!res?.success) {
      console.error("Error in Fetching Menu Details---", res);
      return { hasError: true, message: "Error In Try Block !!" };
    } else {
      return res;
    }
  } catch (err: any) {
    console.error("Error in getMenuDetails==>>>", err);
    return {
      hasError: true,
      message: `Error ${err}`,
    };
  }
};

const getMenuCMSDetails = async () => {
  try {
    const res = await masterDataGetApiService(`${server}/cms-menu`, {});
    if (!res?.success) {
      return { hasError: true, message: "Uanble to fetch menu contents" };
    } else {
      return res;
    }
  } catch (err: any) {
    console.error("Error in getMenuCMSDetails==>>>", err);
    return {
      hasError: true,
      message: `Error ${err}`,
    };
  }
};

export { getMenuDetails, getMenuCMSDetails };
