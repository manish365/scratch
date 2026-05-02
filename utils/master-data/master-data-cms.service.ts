import { server } from "../server";
import { masterDataGetApiService } from "../master-data-api.service";

const getFooterdetails = async () => {
  try {
    const res = await masterDataGetApiService(`${server}/cms-footer`, {});
    // console.log('API Response==>>>', res);
    if (!res?.success) {
      console.error("Error in Fetching Footer Details---", res);
      return { hasError: true, message: "Error In Try Block !!" };
    } else {
      return res;
    }
  } catch (err: any) {
    console.error("Error in getFooterdetails==>>>", err);
    return {
      hasError: true,
      message: `Error ${err}`,
    };
  }
};

const getFooterContentDetails = async () => {
  try {
    const res = await masterDataGetApiService(`${server}/cms-footer-page`, {});
    // console.log('API Response==>>>', res);
    if (!res?.success) {
      console.error("Error in Fetching Footer Details---", res);
      return { hasError: true, message: "Error In Try Block !!" };
    } else {
      return res;
    }
  } catch (err: any) {
    console.error("Error in getFooterdetails==>>>", err);
    return {
      hasError: true,
      message: `Error ${err}`,
    };
  }
};

const getWebsiteMeta = async () => {
  try {
    const url = `${server}/website-meta`;
    const res = await fetch(url, {
      method: "GET",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8",
      },
    });
    // console.log('API Response getWebsiteMeta==>>>', res);
    return await res.json();
  } catch (error) {
    console.error("Error in getWebsiteMeta==>>>", error);
    return {
      hasError: true,
      message: `Error ${error}`,
    };
  }
};

const getHomePageContent = async () => {
  try {
    const url = `${server}/cms-home-page`;
    const res = await fetch(url, {
      method: "GET",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8",
      },
    });
    // console.log('API Response getHomePageContent==>>>', res);
    return await res.json();
  } catch (error) {
    console.error("Error in getHomePageContent==>>>", error);
    return {
      hasError: true,
      message: `Error ${error}`,
    };
  }
};

const getWebsiteCmsData = async () => {
  try {
    const url = `${server}/website-cms-data`;
    const res = await fetch(url, {
      method: "GET",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8",
      },
    });
    return await res.json();
  } catch (error) {
    console.error("Error in getHomePageContent==>>>", error);
    return {
      hasError: true,
      message: `Error ${error}`,
    };
  }
};

export {
  getFooterdetails,
  getFooterContentDetails,
  getWebsiteMeta,
  getHomePageContent,
  getWebsiteCmsData,
};
