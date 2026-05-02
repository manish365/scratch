import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  CartBillingDetailsType, CartMetaDataType, CartShippingDetailsType,
  ProductStoreType, WorkingCartItemType
} from 'types';

interface CartTypes {
  userIp?: string;
  cartError: string;
  generatedOrderNumber?: string;
  isLoggedIn: boolean;
  currentStep: string;
  selectedCity: string;
  cartItems: ProductStoreType[];
  orderTotal: number;
  metaData?: CartMetaDataType;
  shippingDetails: CartShippingDetailsType;
  billingDetails: CartBillingDetailsType;
  showRelatedProductModal: boolean;
  workingCart: WorkingCartItemType;
  discount?: {
    code?: string;
    percent?: number;
    amount?: number;
  };
}

const initialState = {
  userIp: "",
  cartError: "",
  generatedOrderNumber: "",
  currentStep: "shopping-cart",
  selectedCity: "",
  orderTotal: 0,
  isLoggedIn: false,
  cartItems: [],
  metaData: {
    areas: [],
    countryCodes: [],
    countries: [],
    messageCards: [],
    occaision: [],
    hikeDates: []
  },
  shippingDetails: {
    country: "649acae794e2104b3f228e8a",
    mobile: {
      code: "+62",
      value: "",
    },
    hasError: {
      firstName: "",
      lastName: "",
      address: "",
      mobile: "",
      city: "",
      country: "",
      area: "",
    },
  },
  billingDetails: {
    country: "649acae794e2104b3f228e8a",
    address: "others",
    mobile: {
      code: "+62",
      value: "",
    },
    hasError: {
      firstName: "",
      lastName: "",
      address: "",
      mobile: "",
      city: "",
      country: "",
      area: "",
    },
  },
  showRelatedProductModal: false,
  workingCart: {
    variant: "",
    price: 0,
    city: "",
    addOns: [],
    addOnQty: 0,
    addOnPrice: 0,
  },
  discount: {
    amount: 0,
    code: "",
    percent: 0,
  }
} as CartTypes;

const indexSameProduct = (state: CartTypes, action: ProductStoreType) => {
  const sameProduct = (product: ProductStoreType) => (
    product.id === action.id
  );

  return state.cartItems.findIndex(sameProduct)
};

type AddProductType = {
  product: ProductStoreType;
  qty: number;
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<AddProductType>) => {
      const cartItems = state.cartItems;
      const index = indexSameProduct(state, action.payload.product);

      if (index !== -1) {
        cartItems[index].qty += action.payload.qty;
        return;
      }

      return {
        ...state,
        cartItems: [...state.cartItems, action.payload.product],
      };
    },
    editProduct: (
      state,
      action: PayloadAction<{ index: number; key: string; value: any }>
    ) => {
      (state.cartItems as any)[action.payload.index][action.payload.key] =
        action.payload.value;
    },
    removeProduct(state, action: PayloadAction<ProductStoreType>) {
      // find index of product
      state.cartItems.splice(indexSameProduct(state, action.payload), 1);
    },
    removeAllProduct(state) {
      state.cartItems = [];
    },
    setCount(state, action: PayloadAction<AddProductType>) {
      const indexItem = indexSameProduct(state, action.payload.product);
      state.cartItems[indexItem].qty = action.payload.qty;
    },
    setCurrentStep: (state, action: PayloadAction<string>) => {
      console.log(action);
      state.currentStep = action.payload;
    },
    setCartMeta: (state, action: PayloadAction<any>) => {
      state.metaData = action.payload;
    },
    setCartMetaAreas: (state, action: PayloadAction<any>) => {
      state.metaData = {
        ...state.metaData,
        areas: [...action.payload],
      };
    },
    setCartMetaHikeDates: (state, action: PayloadAction<any>) => {
      state.metaData = {
        ...state.metaData,
        hikeDates: [...action.payload],
      };
    },
    updateCartShippingDetails: (state, action: PayloadAction<any>) => {
      state.shippingDetails = {
        ...state.shippingDetails,
        ...action.payload,
      };
    },
    updateCartBillingDetails: (state, action: PayloadAction<any>) => {
      state.billingDetails = {
        ...state.billingDetails,
        ...action.payload,
      };
    },
    resetBillingDetails: (state) => {
      state.billingDetails = {
        country: "Indonesia",
        address: "",
        hasError: {
          firstName: "",
          lastName: "",
          address: "",
          mobile: "",
          city: "",
          country: "",
        },
      };
    },
    resetShippingDetails: (state) => {
      state.shippingDetails = {
        country: "Indonesia",
        address: "",
        hasError: {
          firstName: "",
          lastName: "",
          address: "",
          mobile: "",
          city: "",
          country: "",
        },
      };
    },
    resetBillingError: (state) => {
      const newState = {
        ...state,
        billingDetails: {
          ...state.billingDetails,
          hasError: {
            firstName: "",
            lastName: "",
            address: "",
            mobile: "",
            city: "",
            country: "",
          },
        },
      };
      return newState;
    },
    resetShippingError: (state) => {
      const newState = {
        ...state,
        shippingDetails: {
          ...state.shippingDetails,
          hasError: {
            firstName: "",
            lastName: "",
            address: "",
            mobile: "",
            city: "",
            country: "",
          },
        },
      };
      return newState;
    },
    removeProductByIndex: (state, action: PayloadAction<number>) => {
      state.cartItems = [
        ...state.cartItems.filter((_ct, i) => i !== action.payload),
      ];
    },
    setCountByIndex(
      state,
      action: PayloadAction<{ index: number; value: number }>
    ) {
      state.cartItems[action.payload.index].qty = action.payload.value;
      return state;
    },
    setProductGiftOption(
      state,
      action: PayloadAction<{ index: number; key: string; value: any }>
    ) {
      (state.cartItems[action.payload.index].giftOption as any)[
        action.payload.key
      ] = action.payload.value;
      return state;
    },
    setProductGiftOptionError(
      state,
      action: PayloadAction<{ index: number; key: string; value: any }>
    ) {
      (state.cartItems[action.payload.index].giftOption as any).errors[
        action.payload.key
      ] = action.payload.value;
      return state;
    },
    removeProductGiftOptionError(
      state,
      action: PayloadAction<{ index: number }>
    ) {
      (state.cartItems[action.payload.index].giftOption as any).errors = {
        message: false,
        messageType: false,
        occaision: false,
        senderName: false,
      };
      return state;
    },
    updateCartCity: (state, action: PayloadAction<string>) => {
      const newState: CartTypes = {
        ...state,
        selectedCity: action.payload,
        shippingDetails: {
          ...state.shippingDetails,
          city: action.payload,
        },
      };
      return newState;
    },
    updateCartError: (
      state,
      action: PayloadAction<{
        store: "shippingDetails" | "billingDetails";
        key: string;
        value: string;
      }>
    ) => {
      const newState: CartTypes = {
        ...state,
        [action.payload.store]: {
          ...state[action.payload.store],
          hasError: {
            ...state[action.payload.store].hasError,
            [action.payload.key]: action.payload.value,
          },
        },
      };
      return newState;
    },
    clearCartError: (
      state,
      action: PayloadAction<{ store: "shippingDetails" | "billingDetails" }>
    ) => {
      const newState: CartTypes = {
        ...state,
        [action.payload.store]: {
          ...state[action.payload.store],
          hasError: {
            firstName: "",
            lastName: "",
            address: "",
            mobile: "",
            city: "",
            country: "",
            area: "",
          },
        },
      };
      return newState;
    },
    setCartCreateError: (state, action: PayloadAction<string>) => {
      state.cartError = action.payload;
    },
    setGeneratedCart: (
      state,
      action: PayloadAction<{ total: number; order: string }>
    ) => {
      state.orderTotal = action.payload.total;
      state.generatedOrderNumber = action.payload.order;
    },
    setUserIp: (state, action: PayloadAction<string>) => {
      state.userIp = action.payload;
    },
    toggleAddonModal: (state) => {
      state.showRelatedProductModal = !state.showRelatedProductModal;
    },
    updateWorkingCart: (state, action: PayloadAction<any>) => {
      const newState: CartTypes = {
        ...state,
        workingCart: {
          ...state.workingCart,
          ...action.payload,
        },
      };
      return newState;
    },
    setAddonCountByIndex(
      state,
      action: PayloadAction<{ cartIndex: number; index: number; qty: number }>
    ) {
      state.cartItems[action.payload.cartIndex].addOns[
        action.payload.index
      ].qty = action.payload.qty;
      return state;
    },
    removeAddonByIndex: (
      state,
      action: PayloadAction<{ cartIndex: number; index: number }>
    ) => {
      state.cartItems[action.payload.cartIndex].addOns.splice(
        action.payload.index,
        1
      );
    },
    resetWorkingCart: (state) => {
      state.workingCart = {
        variant: "",
        price: 0,
        city: "",
        addOns: [],
        addOnQty: 0,
        addOnPrice: 0,
      };
    },
    updateWorkingCartAddons: (state) => {
      const newState: CartTypes = {
        ...state,
        workingCart: {
          ...state.workingCart,
          addOns: [],
          addOnPrice: 0,
          addOnQty: 0,
        },
      };
      return newState;
    },
    setCartDiscount: (
      state,
      action: PayloadAction<{ code: string; amount: number; percent: number }>
    ) => {
      state.discount = {
        code: action.payload.code,
        amount: action.payload.amount,
        percent: action.payload.percent,
      };
    },
    resetCartDiscount: (state) => {
      state.discount = {
        code: "",
        amount: 0,
        percent: 0,
      };
    },
  },
});

export const {
  addProduct,
  editProduct,
  removeProduct,
  setCount,
  setCurrentStep,
  setCartMeta,
  setCartMetaAreas,
  setCartMetaHikeDates,
  updateCartShippingDetails,
  updateCartBillingDetails,
  removeProductByIndex,
  setCountByIndex,
  setProductGiftOption,
  setProductGiftOptionError,
  removeProductGiftOptionError,
  updateCartCity,
  updateCartError,
  clearCartError,
  setCartCreateError,
  setGeneratedCart,
  setUserIp,
  removeAllProduct,
  resetBillingDetails,
  resetShippingDetails,
  resetBillingError,
  resetShippingError,
  toggleAddonModal,
  updateWorkingCart,
  setAddonCountByIndex,
  removeAddonByIndex,
  updateWorkingCartAddons,
  resetWorkingCart,
  setCartDiscount,
  resetCartDiscount,
} = cartSlice.actions;

export default cartSlice.reducer;
