import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getExchageRateFromState } from "@utils/localstorage";

interface PropType {
  _id: string | number;
  image: string;
  name: string;
  price: string;
  productId?: string;
}
function OnlyProductCard({ _id, image, name, price, productId }: PropType) {
  const { websiteMeta } = useSelector((state: any) => state.cms);
  const [websiteMetaData, setWebsiteMetaData] = useState<any>(null);
  const currentRate = getExchageRateFromState();

  const router = useRouter();
  const maintainanceMode = false;
  const onClickProduct = () => {
    // console.log(productId);
    if (maintainanceMode) {
      router.push(`/coming-soon`);
    } else {
      router.push(`/products/details/${productId}`);
    }
  };
  useEffect(() => {
    const websiteMetabasicDetailsRes = websiteMeta?.["payload"]?.["basic"];
    if (websiteMetabasicDetailsRes) {
      setWebsiteMetaData(websiteMetabasicDetailsRes);
    }
    return () => {
      setWebsiteMetaData(null);
    };
  }, [websiteMeta]);

  return (
    <div className="pro-bx1">
      <button onClick={onClickProduct}>
        <img
          className="pro-img img-fluid w-100"
          src={image}
          title="Bouquet of Pink Roses &amp; Red Roses"
          alt={`image-${_id}-${name}}`}
        />
        <h3>{name}</h3>
        <span>
          {" "}
          {websiteMetaData?.primaryCurrency ||
            websiteMetaData?.secondaryCurrency}{" "}
          {(+price)?.toFixed(2)}
          {" / $"}
          {(+price / +currentRate)?.toFixed(2)}{" "}
        </span>
      </button>
      <a href="#!" className="update hov" onClick={onClickProduct}>
        Buy Now
      </a>
    </div>
  );
}

export default OnlyProductCard
