import { useRouter } from "next/router";
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from "store"; 

function HomeFlowersCombo(props: any) {
  const [homeFlowersComboData, setHomeFlowersComboData] = useState<any>(null);

  const { websiteMeta } = useSelector((state: RootState) => state.cms);  
  const [websiteMetaData, setWebsiteMetaData] = useState<any>(null);
  const router = useRouter();
  const onClick = (event: any, link: any) => {
    event.preventDefault();
    if (link) {
      router.push(link);
    } else {
      router.push('/coming-soon'); // Assuming '/coming-soon' is the route for the coming soon page
    }
  }
  useEffect(() => {
    setHomeFlowersComboData(props.flowersComboData || []);

    const websiteMetabasicDetailsRes = websiteMeta?.['payload']?.['basic'];
    if(websiteMetabasicDetailsRes) {
      setWebsiteMetaData(websiteMetabasicDetailsRes);
    }
  }, [props.flowersComboData, websiteMeta]);
  const lastItem: any = homeFlowersComboData?.products?.[homeFlowersComboData?.products?.length - 1];

  return (
    <div className="dc-box bx-shadow">
      <a href="#" className="spesh-offer">
        {" "}
        <img
          src="images/gift-hampers.webp"
          className="img-fluid w-100 mb-4"
          alt="Special Deal"
          loading="lazy"
        />{" "}
      </a>

      <div className="col-lg-12">
        <div className="row mbo-row">
          {homeFlowersComboData?.products?.slice(0, -1)?.map((item: any) => (
            <div className="col-md-4 col-6" key={item?.seq}>
              <div className="pro-bx1" key={item?._id}>
                <a onClick={(event) => onClick(event, item?.link)}>
                  <img
                    className="pro-img img-fluid w-100"
                    src={item?.url}
                    title={item?.name}
                    alt={item?.name}
                    loading="lazy"
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

export default HomeFlowersCombo;
