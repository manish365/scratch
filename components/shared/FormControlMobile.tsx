import React, { memo, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
import { updateCartBillingDetails, updateCartShippingDetails } from 'store/reducers/cart';
import { SelectSearch } from '@components/shared';

interface PropTypes {
  storeKey?: "shippingDetails" | "billingDetails";
}

function FormControlMobile({ storeKey = "shippingDetails" }: PropTypes) {
  const dispatch = useDispatch()
  const { metaData, shippingDetails, billingDetails } = useSelector((store: RootState) => store.cart);
  const [currentValue, setCurrentValue] = useState<{
    code: string;
    value: string;
  }>({
    code: "+62",
    value: "",
  });

  useEffect(() => {
    if (storeKey === 'shippingDetails') {
      setCurrentValue({
        code: shippingDetails.mobile?.code || '+62',
        value: shippingDetails.mobile?.value || '',
      });
    } else if (storeKey === 'billingDetails') {
      setCurrentValue({
        code: billingDetails.mobile?.code || "+62",
        value: billingDetails.mobile?.value || "",
      });
    }
  
    return () => {
      setCurrentValue({
        code: '+62', value: ''
      });
    }
  }, [])

  const updateCurrentValue = (key: string, value: string) => {
    const cv = { ...currentValue, [key]: value };
    setCurrentValue(cv);
    if (storeKey === "shippingDetails") {
      dispatch(updateCartShippingDetails({ mobile: cv }));
    } else if (storeKey === 'billingDetails') {
      dispatch(updateCartBillingDetails({ mobile: cv }));
    }
  };

  return (
    <>
      <div className="row">
        <div className="col-md-3">
          <SelectSearch
            list={metaData?.countryCodes || []}
            onChange={(value: string) =>
              updateCurrentValue("code", value)
            }
            value={
              storeKey == "shippingDetails"
                ? (shippingDetails?.mobile?.code ?? '+62')
                : (billingDetails?.mobile?.code ?? '+62')
            }
            placeholder='Country Code'
            disabled={false}
            countryFlag={true}
          />
        </div>
        <div className="col-md-9">
          <input
            type="text"
            className="form-control"
            placeholder="e.g. 702 123 4566"
            value={
              storeKey == "shippingDetails"
                ? shippingDetails?.mobile?.value
                : billingDetails?.mobile?.value
            }
            onChange={($e) => updateCurrentValue("value", $e.target.value)}
          />
        </div>
      </div>
      <div className="row">
        {storeKey === "shippingDetails" &&
          shippingDetails?.hasError?.mobile && (
            <p className="message message--error" style={{ marginTop: "0" }}>
              Mobile number and prefix is required.
            </p>
          )}

        {storeKey === "billingDetails" && billingDetails?.hasError?.mobile && (
          <p className="message message--error" style={{ marginTop: "0" }}>
            Mobile number and prefix is required.
          </p>
        )}
      </div>
    </>
  );
}

export default memo(FormControlMobile);
