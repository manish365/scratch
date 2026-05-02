import { createSlice } from '@reduxjs/toolkit';
import {
  getFooterdetails,
  getFooterContentDetails,
  getHomePageContent,
  getWebsiteMeta,
  getWebsiteCmsData,
} from "../../utils/master-data/master-data-cms.service";
import { ProductDetailsPageContentType } from '~types/General';
import { getCMSDataWithTimer, saveCMSDataWithTimer } from '@utils/localstorage';

interface CMSType {
  footerData: any;
  footerContentData: any;
  websiteMeta: any;
  homePageContent: any;
  mobileMenuOpened: boolean;
  deliveryModalOpened: boolean;
  productDetailsPageContent: ProductDetailsPageContentType | null;
}

const initialState: CMSType = {
  footerData: null,
  footerContentData: null,
  websiteMeta: null,
  homePageContent: null,
  mobileMenuOpened: false,
  deliveryModalOpened: false,
  productDetailsPageContent: null,
};


const cmsSlice = createSlice({
  name: "cms",
  initialState,
  reducers: {
    setCMSFooter: (state, action) => {
      state.footerData = action.payload;
    },
    clearCMSFooter: (state) => {
      state.footerData = null;
    },
    setCMSFooterContent: (state, action) => {
      state.footerContentData = action.payload;
    },
    clearCMSFooterContent: (state) => {
      state.footerContentData = null;
    },
    setWebsiteMeta: (state, action) => {
      state.websiteMeta = action.payload;
    },
    clearWebsiteMeta: (state) => {
      state.websiteMeta = null;
    },
    setHomePageContent: (state, action) => {
      state.homePageContent = action.payload;
    },
    clearHomePageContent: (state) => {
      state.homePageContent = null;
    },
    setProductDetailsPageContent: (state, action) => {
      state.productDetailsPageContent = action.payload;
    },
    clearProductDetailsPageContent: (state) => {
      state.productDetailsPageContent = null;
    },
    toggleMobileMenu: (state) => {
      state.mobileMenuOpened = !state.mobileMenuOpened;
    },
    hideMobileMenu: (state) => {
      state.mobileMenuOpened = false;
    },
    toggleDeliveryModal: (state) => {
      state.deliveryModalOpened = !state.deliveryModalOpened;
    },
  },
});

export const {
  setCMSFooter,
  clearCMSFooter,
  setCMSFooterContent,
  clearCMSFooterContent,
  setWebsiteMeta,
  clearWebsiteMeta,
  toggleMobileMenu,
  hideMobileMenu,
  toggleDeliveryModal,
  setHomePageContent,
  clearHomePageContent,
  setProductDetailsPageContent,
  clearProductDetailsPageContent,
} = cmsSlice.actions;
export default cmsSlice.reducer;


export const fetchFooterData = () => async (dispatch: any) => {
  const key = "cms-footer";
  const expiresAfter = process.env.NEXT_PUBLIC_CACHE_EXPIRE || "60000";
  try {
    // get data from cache with key "cms-footer"
    const cachedData = getCMSDataWithTimer(key);
    if (cachedData) {
      dispatch(setCMSFooter(cachedData));
      return;
    } else {
      const res: any = await getFooterdetails();
      if (res?.success) {
        saveCMSDataWithTimer(key, res, +expiresAfter);
        dispatch(setCMSFooter(res));
        return;
      }
    }
  } catch (err) {
    console.error('Error fetching footer data:', err);
    dispatch(clearCMSFooter());
  }
};

export const fetchFooterContentData = () => async (dispatch: any) => {
  const key = "cms-footer-page";
  const expiresAfter = process.env.NEXT_PUBLIC_CACHE_EXPIRE || "60000";
  try {
    const cachedData = getCMSDataWithTimer(key);
    if (cachedData) {
      dispatch(setCMSFooter(cachedData));
      return;
    } else {
      const res: any = await getFooterContentDetails();
      if (res?.success) {
        saveCMSDataWithTimer(key, res, +expiresAfter);
        dispatch(setCMSFooterContent(res));
        return;
      }
    }
  } catch (err) {
    console.error('Error fetching footer content data:', err);
    dispatch(clearCMSFooterContent());
  }
};

export const fetchWebsiteMeta = () => async (dispatch: any) => {
  try {
    // get the meta and save it
    const res: any = await getWebsiteMeta();
    if (res?.success) {
      dispatch(setWebsiteMeta({ payload: res.results[0] }));
    }
  } catch (err) {
    console.error('Error fetching Home Page data:', err);
    dispatch(clearWebsiteMeta());
  }
};

export const fetchHomePageData = () => async (dispatch: any) => {
  try {
    // get the meta and save it
    const res: any = await getHomePageContent();
    if (res?.success) {
      dispatch(setHomePageContent({ payload: res.results[0] }));
    }
  } catch (err) {
    console.error('Error fetching Home Page data:', err);
    dispatch(clearHomePageContent());
  }
};

export const fetchWebsiteCmsData = () => async (dispatch: any) => {
  try {
    // get the meta and save it
    const res: any = await getWebsiteCmsData();
    if (res?.success) {
      dispatch(setHomePageContent({ payload: res.results.home[0] }));
      dispatch(
        setProductDetailsPageContent(res.results.productDetails[0])
      );
    }
  } catch (err) {
    console.error("Error fetching Home Page data:", err);
    dispatch(clearHomePageContent());
  }
};
