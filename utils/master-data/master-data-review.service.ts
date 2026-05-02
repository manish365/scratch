import { server } from "../server";
import { masterDataGetApiService } from "../master-data-api.service";

const getReviewDetails = async (page = 1, limit = 10) => {
  try {
    const res = await masterDataGetApiService(`${server}/review?page=${page}&limit=${limit}`, {});

    if (!res?.success) {
      console.error("Error in Fetching Review Details---", res);
      return { hasError: true, message: "Error while fetching reviews" };
    } else {
      return res;
    }
  } catch (err: any) {
    return {
      hasError: true,
      message: `Error ${err}`,
    };
  }
};

export { getReviewDetails };
