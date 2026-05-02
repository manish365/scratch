export interface UserProfileType {
  company?: CompanyType
  email: EmailType
  profile?: ProfileType
  bank?: Bank
  _id?: string
  accountId?: string
  accountType?: string
  site?: string
  purchaseEntryClass?: string
  status: string
  password?: string
  billMeLater?: string
  deliveryCities?: any[]
  emailAlt?: string
  orderDiscount?: string
  address: any[]
}

export interface CompanyType {
  name: string
  contact: string
  address: string
  registrationDate: any
  vatCheck: string
  vatNumber: string
}

export interface EmailType {
  address: string
  verified: boolean
}

export interface ProfileType {
  mobile: Mobile
  name: string
  address: string
  state: string
  stateName?: string
  country: string
  countryName?: string
  zipCode: string
  contactNumber: string
}

export interface Mobile {
  number: string
  prefix: string
  verified: boolean
}

export interface Bank {
  identity: Identity
  bankName: string
  branch: string
  accType: string
  accountHolder: string
  accountNumber: string
  ifsc: string
}

export interface Identity {
  cardType: string
  cardNumber: string
}
