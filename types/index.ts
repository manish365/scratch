import { PriceHikeDateType } from "./General";

export type VotesType = {
  count: number;
  value: number;
}

export type PunctuationType = {
  countOpinions: number;
  punctuation: number;
  votes: VotesType[]
}

export type ReviewType = {
  name: string;
  avatar: string;
  description: string;
  punctuation: number;
}

export type ProductType = {
  id: string;
  name: string;
  thumb: string;
  price: string;
  count: number;
  color: string;
  size: string;
  images: string[];
  discount?: string;
  currentPrice: number;
  punctuation: PunctuationType;
  reviews: ReviewType[];
}

export type ProductTypeList = {
  id: string;
  name: string;
  price: string;
  color: string;
  images: string[];
  discount?: string;
  currentPrice?: number;
}

export type ProductStoreType = {
  id: string;
  code: string;
  name: string;
  thumb: string;
  qty: number;
  variant: string;
  variantPrice: number;
  glassVaseAdded: boolean;
  glassVasePrice: number;
  eggLess: boolean;
  eggLessPrice: number;
  delivery: {
    type: string;
    date: string;
    time: {
      _id: string;
      type: string;
      from: string;
      to: string;
    };
    price: number;
  };
  giftOption?: {
    messageType: string;
    message: string;
    occaision: string;
    senderName: string;
    errors?: {
      message?: boolean;
      messageType?: boolean;
      occaision?: boolean;
      senderName?: boolean;
    };
  };
  addOns: any[];
  addOnQty: number;
  addOnPrice: number;
  countryName?: string;
  cityId?: string;
  cityName?: string;
  priceUpdatedPercent?: number;
};

export type GtagEventType = {
  action: string;
  category: string; 
  label: string;
  value: string
}

export interface CartMetaDataType {
  countryCodes?: any[];
  messageCards?: any[];
  occaision?: any[];
  areas?: any[];
  countries?: any[];
  hikeDates?: PriceHikeDateType[];
}

export interface CartShippingDetailsType {
  firstName?: string;
  lastName?: string;
  address?: string;
  mobile?: {
    code: string;
    value: string;
  };
  city?: string;
  cityName?: string;
  country: string;
  hasError?: {
    firstName?: string;
    lastName?: string;
    address?: string;
    mobile?: string;
    city?: string;
    country?: string;
  };
}

export interface CartBillingDetailsType {
  firstName?: string;
  lastName?: string;
  address?: string;
  mobile?: {
    code: string;
    value: string;
  };
  city?: string;
  country?: string;
  hasError?: {
    firstName?: string;
    lastName?: string;
    address?: string;
    mobile?: string;
    city?: string;
    area?: string;
    country?: string;
  };
}

export interface WorkingCartItemType {
  variant: string;
  price: number;
  city: string;
  addOns: any[];
  addOnQty: number;
  addOnPrice: number;
}

export interface CitySlotType {
  dtype: string;
  from: string;
  to: string;
  price: number;
  cutoff?: number;
  _id: string;
}