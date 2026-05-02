import useDefaultCurrency from '@hooks/useDefaultCurrency';
import React, { useState } from 'react'
interface PropType {
  title: string;
  desc?: string;
  price?: any;
  priceUSD?: number;
  htmlFor?: string;
}
function VariantCard({
  title = "Classic",
  desc = '',
  price,
  priceUSD,
  htmlFor = "flexRadioDefault1",
}: PropType) {
  const [allowReadMore] = useState(false)
  const [smallDesc, setSmallDesc] = useState(desc?.substring(0, 56));
  const [showReadMore, setShowReadMore] = useState(true);
  const [currency] = useDefaultCurrency();

  const onToggleReadMore = () => {
    setShowReadMore(!showReadMore);
    if (showReadMore) {
      setSmallDesc(desc);
    } else {
      setSmallDesc(desc?.substring(0, 56));
    }
  }

  return (
    <div>
      <label htmlFor={htmlFor}>{title}</label> <br />
      {desc && (
        <>
          {allowReadMore && desc.length > 56 && (
            <>
              <span>{smallDesc}...</span>
              {showReadMore && (
                <button className="btn-link ml-2" onClick={onToggleReadMore}>
                  read more
                </button>
              )}
              {!showReadMore && (
                <button className="btn-link ml-2" onClick={onToggleReadMore}>
                  read less
                </button>
              )}
            </>
          )}
          {allowReadMore && desc.length <= 56 && <span>{desc}</span>}
          {!allowReadMore && <span>{desc}</span>}
          <br />
        </>
      )}
      {currency} <span>{(+price)?.toFixed(2)}</span>
      <span className="ml-4">$ {priceUSD}</span>
    </div>
  );
}

export default VariantCard
