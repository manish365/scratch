import { ProductStoreType } from './../types/index';
export const validateAddToCartObject = (catObj: ProductStoreType): [boolean, string] => {
  let isError = false;
  let errorMessage = '';

  console.log('catObj===>>>', catObj);

  if (!catObj.code) {
    isError = true;
    errorMessage = "Invalid Product";
  } else if (!catObj.variant) {
    isError = true;
    errorMessage = "Please choose product variant first";
  } else if (!catObj.delivery?.date) {
    isError = true;
    errorMessage = "Please choose a valid delivery date";
  } else if (!catObj.delivery?.time?.type) {
    isError = true;
    errorMessage = "Please choose a valid delivery type";
  } else if (!catObj.delivery?.time?.from) {
    isError = true;
    errorMessage = "Please choose a valid delivery slot";
  }

  return [isError, errorMessage]
};
