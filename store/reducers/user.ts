import { remove } from 'lodash';
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UserProfileType } from '../../types/profile'

type ProductType = {
  id: string;
  name: string;
  thumb: string;
  price: string;
  count: number;
  color: string;
  size: string;
}

type ToggleFavType = {
  id: string;
}

interface UserSliceTypes {
  dashboradSidebarState: boolean;
  user: any;
  favProducts: any;
  profile: any;
}

const initialState: UserSliceTypes = {
  dashboradSidebarState: false,
  user: {
    name: '',
    email: '',
    // status: 'ACTIVE'
    status: ''
  },
  favProducts: [],
  profile: {
    address: [],
    email: "",
    status: "",
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfile(state, action: PayloadAction<UserProfileType>) {
      state.profile = action.payload
    },
    updateProfile(state, action: PayloadAction<UserProfileType>) {
      state.profile = action.payload
    },
    clearProfile(state) {
      state.profile = null;
    },
    setUser(state, action: PayloadAction<any>) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = null;
    },
    toggleFavProduct(state, action: PayloadAction<ToggleFavType>) {
      const index = state.favProducts.includes(action.payload.id);

      if(!index) {
        state.favProducts.push(action.payload.id);

        return;
      }

      remove(state.favProducts, id => id === action.payload.id);
    },
    setUserLogged(state, action: PayloadAction<ProductType>) {
      const index = state.favProducts.includes(action.payload.id);

      if(!index) {
        state.favProducts.push(action.payload.id);

        return {
          ...state,
          favProducts: state.favProducts
        };
      }

      remove(state.favProducts, id => id === action.payload.id);
      
      return {
        ...state,
        favProducts: state.favProducts
      };
    },
    toggleDashboardSidebar(state, action: PayloadAction<boolean>) {
      console.log('>>>>', action.payload);
      state.dashboradSidebarState = action.payload
    }
  },
})

export const {
  toggleFavProduct,
  setUserLogged,
  setProfile,
  updateProfile,
  clearProfile,
  setUser,
  clearUser,
  toggleDashboardSidebar,
} = userSlice.actions;
export default userSlice.reducer