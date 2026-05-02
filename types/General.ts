export interface BreadCrumbType {
  title: string;
  link: string;
}

export interface ProductListTopSectionLinksType {
  title: string;
  link: string;
  type: 'Button' | 'Link';
  _id: string;
}

export interface CategoryType {
  createdAt: string;
  description: string;
  name: string;
  status: string;
  updatedAt: string;
  website: string;
  _id: string;
}

export interface CustomProductColType {
  img: string;
  imgAlt: string;
  title: string;
  number: number;
}

export interface ReviewType {
  product?: {
    _id: string;
    name: string;
  };
  _id: string;
  website?: {
    _id: string;
    name: string;
    url: string;
    status: string;
    createdAt?: string;
    updatedAt?: string;
  };
  orderId?: string;
  rating: string;
  title: string;
  review: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductDetailsPageContentType {
  _id?: string;
  website: string;
  country: string;
  deliveryInformation: string;
  flowerCareGuide: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface PriceHikeDateType {
  website: string;
  country: string;
  date: string;
  addedByUser: string;
  updatedPrice: number;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}

export interface CMSFAQType {
  _id: string;
  question: string;
  answer: string;
  updatedBy: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderProductType {
  giftOption?: {
    message?: string;
    messageType?: string;
    occaision?: string;
    senderName?: string;
  };
  _id: string;
  name: string;
  description?: string;
  option?: string;
  variant?: string;
  qty?: number;
  unitPrice?: any;
  vatRate?: string;
  vat?: string;
  originalPrice?: any;
  image?: string;
  glassVaseAdded?: boolean;
  eggLess?: boolean;
  glassVasePrice?: string;
  egglessPrice?: string;
  addOns?: any[];
}
