import { FormControlMobile, SelectSearch } from '@components/shared';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
import { updateCartBillingDetails } from 'store/reducers/cart';

function BillingDetails() {
  const dispatch = useDispatch();
  const { metaData, billingDetails, shippingDetails } = useSelector((store: RootState) => store.cart);
  const [isShippingData, setIsShippingData] = useState<boolean>(false);

  const handleShippingDataChange = (event: any) => {
    setIsShippingData(event?.target?.checked);
    if (event?.target?.checked) {
      ["firstName", "lastName", "city", "country", "mobile"].forEach(
        (control) => {
          updateBillingDetails(control, (shippingDetails as any)[control]);
        }
      );
    }
  }

  const updateBillingDetails = (key: string, value: string) => {
    dispatch(updateCartBillingDetails({ [key]: value }));
  }

  const fetchCityNameFromId = (cityId: string = "") => {
    if (!cityId) {
      return "";
    }
    return metaData?.areas?.filter((area) => area._id === cityId)[0]?.name;
  };

  return (
    <>
      <div className="flex items-center justify-between w-full">
        <span className="underline text-2xl">Billing Details</span>
        <div className="checkbox-wrapper flex items-center mx-3">
          <label
            htmlFor="check-signed-in"
            className={`checkbox checkbox--sm mb-0`}
          >
            <input
              type="checkbox"
              name="sameAsShippingDetails"
              id="check-signed-in"
              onChange={handleShippingDataChange}
              checked={isShippingData}
            />
            <span className="checkbox__check"></span>
            <p className="mb-0 p-0">Same as Shipping Details</p>
          </label>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="First Name"
            name="fName"
            value={billingDetails?.firstName}
            onChange={($e) =>
              updateBillingDetails("firstName", $e.target.value)
            }
          />

          {billingDetails?.hasError?.firstName && (
            <p className="message message--error" style={{ marginLeft: "5px" }}>
              First Name is required.
            </p>
          )}
        </div>
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Last Name"
            name="lName"
            value={billingDetails?.lastName}
            onChange={($e) => updateBillingDetails("lastName", $e.target.value)}
          />

          {billingDetails?.hasError?.lastName && (
            <p className="message message--error" style={{ marginLeft: "5px" }}>
              Last Name is required.
            </p>
          )}
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Enter City"
            name="city"
            value={fetchCityNameFromId(billingDetails?.city)}
            onChange={($e) => updateBillingDetails("city", $e.target.value)}
          />
        </div>
        <div className="col-md-6">
          {metaData?.countries && (
            <SelectSearch
              list={metaData?.countries}
              onChange={(value: string) =>
                updateBillingDetails("country", value)
              }
              value={billingDetails?.country}
              disabled={false}
              countryFlag={false}
            />
          )}

          {billingDetails?.hasError?.country && (
            <p className="message message--error" style={{ marginLeft: "5px" }}>
              Country is required.
            </p>
          )}
        </div>
        <div className="col-md-12 mt-4">
          <FormControlMobile storeKey="billingDetails" />
        </div>
      </div>
    </>
  );
}

export default BillingDetails
