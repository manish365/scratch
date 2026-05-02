import React, { memo } from 'react'
import { useSelector } from 'react-redux';
import { RootState } from 'store';

function DeliveryInformation() {
  const { productDetailsPageContent } = useSelector(
    (store: RootState) => store.cms
  );
    return (
      <div className="mt-4">
        <h4>Delivery Information:</h4>
        <div
          className="product-flower-care-guide"
          dangerouslySetInnerHTML={{
            __html: productDetailsPageContent?.deliveryInformation || "",
          }}
        />
      </div>
    );
}

export default memo(DeliveryInformation)
