import { CartBillingDetailsType, CartShippingDetailsType } from '../../types/index';

const validateShippingDetails = (
  shippingDetails: CartShippingDetailsType
): [boolean, string, string] => {
  if (!shippingDetails?.firstName?.trim()) {
    return [false, "firstName", "Please enter a valid first name"];
  }

  if (!shippingDetails?.lastName?.trim()) {
    return [false, "lastName", "Please enter a valid last name"];
  }

  if (!shippingDetails?.city?.trim()) {
    return [false, "city", "Please enter a valid city"];
  }

  if (!shippingDetails?.country?.trim()) {
    return [false, "country", "Please enter a valid country"];
  }

  if (!shippingDetails?.address?.trim()) {
    return [false, "address", "Please enter a valid address"];
  }

  if (
    !shippingDetails?.mobile?.code?.trim() ||
    !shippingDetails?.mobile?.value?.trim()
  ) {
    return [false, "mobile", "Please enter a valid mobile"];
  }
  return [true, "", ""];
};

const validateBillingDetails = (
  billingDetails: CartBillingDetailsType
): [boolean, string, string] => {
  if (
    !billingDetails?.firstName?.trim()
  ) {
    return [false, "firstName", "Please enter a valid first name"];
  }

  if (!billingDetails?.lastName?.trim()) {
    return [false, "lastName", "Please enter a valid last name"];
  }

  if (!billingDetails?.city?.trim()) {
    return [false, "city", "Please enter a valid city"];
  }

  if (!billingDetails?.country?.trim()) {
    return [false, "country", "Please enter a valid country"];
  }

  if (
    !billingDetails?.mobile?.code?.trim() ||
    !billingDetails?.mobile?.value?.trim()
  ) {
    console.log(billingDetails.mobile);
    return [false, "mobile", "Please enter a valid mobile"];
  }
  return [true, '', ''];
};

export { validateShippingDetails, validateBillingDetails };
