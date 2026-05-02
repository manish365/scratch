import { useRouter } from "next/router";
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from "store"; 

function HomeSpecialDeals(props: any) {
  const [homeSpecialDealData, setHomeSpecialDealData] = useState<any>(null);
  const { websiteMeta } = useSelector((state: RootState) => state.cms);  
  const [websiteMetaData, setWebsiteMetaData] = useState<any>(null);
  const router = useRouter();
  const onClick = (event: any, link: any) => {
    console.log(link);
    event.preventDefault();
    if (link) {
      router.push(link);
    } else {
      router.push('/coming-soon');
    }
  }
  useEffect(() => {
    setHomeSpecialDealData(props.specialDealData || []);

    const websiteMetabasicDetailsRes = websiteMeta?.['payload']?.['basic'];
    if(websiteMetabasicDetailsRes) {
      setWebsiteMetaData(websiteMetabasicDetailsRes);
    }
  }, [props.specialDealData, websiteMeta]);
  const lastItem: any = homeSpecialDealData?.products?.[homeSpecialDealData?.products?.length - 1];

  return (
    <div className="dc-box bx-shadow">
      <a href="#" className="spesh-offer">
        {" "}
        <img
          src="images/special-deals-gifts-flowers.webp"
          className="img-fluid w-100 mb-4"
          alt="Special Deal"
          loading="lazy"
        />{" "}
      </a>

      <div className="col-lg-12">
        <div className="row mob-row">
          {homeSpecialDealData?.products?.slice(0, -1)?.map((item: any) => (
            <div className="col-md-4 col-6" key={item?.seq}>
              <div className="pro-bx1" key={item?._id}>
                <a onClick={(event) => onClick(event, item?.link)}>
                  <img
                    className="pro-img img-fluid w-100"
                    loading="lazy"
                    src={item?.url}
                    title={item?.name}
                    alt={item?.name}
                  />
                  <h3>{item?.name}</h3>
                  <span>
                    {" "}
                    {websiteMetaData?.primaryCurrency ||
                      websiteMetaData?.secondaryCurrency}{" "}
                    {(+item?.price)?.toFixed(2)}{" "}
                  </span>
                </a>
                <a
                  onClick={(event) => onClick(event, item?.link)}
                  className="update hov"
                >
                  Buy Now
                </a>
              </div>
            </div>
          ))}

          {lastItem && (
            <div className="col-md-4 desktop-view" key={lastItem?.seq}>
              <div className="pro-bx1" key={lastItem?._id}>
                <a onClick={(event) => onClick(event, lastItem?.link)}>
                  <img
                    className="pro-img img-fluid w-100"
                    src={lastItem?.url}
                    title={lastItem?.name}
                    alt={lastItem?.name}
                    loading="lazy"
                  />
                  <h3>{lastItem?.name}</h3>
                  <span>
                    {" "}
                    {websiteMetaData?.primaryCurrency ||
                      websiteMetaData?.secondaryCurrency}{" "}
                    {(+lastItem?.price)?.toFixed(2)}{" "}
                  </span>
                </a>
                <a
                  onClick={(event) => onClick(event, lastItem?.link)}
                  className="update hov"
                >
                  Buy Now
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomeSpecialDeals
