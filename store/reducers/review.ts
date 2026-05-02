import { createSlice } from "@reduxjs/toolkit";
import { getReviewDetails } from "../../utils/master-data/master-data-review.service";

interface ReviewType {
  product: any;
  _id: string;
  website?: {
    _id: string;
    name: string;
    url: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  },
  orderId?: string;
  rating?: number;
  title: string;
  review?: string;
  name: string;
  email: string;
  phone?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface ReviewStoreType {
  reviewData: ReviewType[];
}

const initialState: ReviewStoreType = {
  reviewData: [],
};

const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
    setReview: (state, action) => {
      state.reviewData = action.payload;
    },
    mergeReviews: (state, action) => {
      state.reviewData = [...action.payload, ...state.reviewData];
    },
    clearReview: (state) => {
      state.reviewData = [];
    },
  },
});

export const { setReview, mergeReviews, clearReview } = reviewSlice.actions;
export default reviewSlice.reducer;

export const fetchReviewData =
  (page = 1, limit = 10, reset: boolean = true) =>
  async (dispatch: any) => {
    try {
      const res: any = await getReviewDetails(page, limit);
      if (res?.success) {
        if (reset) {
          dispatch(setReview(res.results));
        } else {
          dispatch(mergeReviews(res.results));
        }
      }
      return { hasError: true, message: "Error In Try Block !!" };
    } catch (err) {
      console.error("Error fetching footer data:", err);
      dispatch(clearReview());
    }
  };
