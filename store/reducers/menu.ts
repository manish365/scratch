import { createSlice } from "@reduxjs/toolkit";
import {
  getMenuDetails,
  getMenuCMSDetails,
} from "../../utils/master-data/master-data-menu.service";
import { getCMSDataWithTimer, saveCMSDataWithTimer } from "@utils/localstorage";

export interface CMSMenuType {
  _id: string;
  bannerTemplate?: string;
  box: any[];
  contentBottom: string;
  contentTop: string;
  createdAt: string;
  menuName: string;
  menuType: string;
  seoDescription?: string;
  seoKeywords?: string;
  seoTitle?: string;
  seoURL?: string;
  seoURLGLOBAL?: string;
  updatedAt: string;
  status: boolean;
}
interface MenuType {
  menuData: MenuDataType[];
  menuCMSData: CMSMenuType[];
}

export interface MenuDataType {
  categories: SubMenuType[];
  createdAt: string;
  image: string;
  isHot: boolean;
  link: string;
  seq: number;
  title: string;
  updatedAt: string;
  _id: string;
}

interface SubMenuType {
  isHeader: boolean;
  link: string;
  seq: number;
  title: string;
  _id: string;
}

const initialState: MenuType = {
  menuData: [],
  menuCMSData: [],
};

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setMenu: (state, action) => {
      state.menuData = action.payload;
    },
    clearMenu: (state) => {
      state.menuData = [];
    },
    setMenuCMSContent: (state, action) => {
      state.menuCMSData = action.payload;
    },
    clearMenuCMSContent: (state) => {
      state.menuCMSData = [];
    },
  },
});

export const { setMenu, clearMenu, setMenuCMSContent, clearMenuCMSContent } =
  menuSlice.actions;
export default menuSlice.reducer;

export const fetchMenuData = () => async (dispatch: any) => {
  const key = "menu";
  const expiresAfter = process.env.NEXT_PUBLIC_MENU_CACHE_EXPIRE || "30000";
  try {
    const cachedData = getCMSDataWithTimer(key);
    if (cachedData) {
      dispatch(setMenu(cachedData));
      return;
    } else {
      const res: any = await getMenuDetails();
      if (res?.success) {
        saveCMSDataWithTimer(key, res.results, +expiresAfter);
        dispatch(setMenu(res.results));
        return;
      }
    }
  } catch (err) {
    console.error("Error fetching menu data:", err);
    dispatch(clearMenu());
  }
};

export const fetchMenuCMSContent = () => async (dispatch: any) => {
  try {
    const res: any = await getMenuCMSDetails();
    if (res?.success) {
      dispatch(setMenuCMSContent(res.results));
    }
    return { hasError: true, message: "Error In Try Block !!" };
  } catch (err) {
    console.error("Error fetching footer data:", err);
    dispatch(clearMenuCMSContent());
  }
}
