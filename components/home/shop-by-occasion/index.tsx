import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";

const HomeShopByOccasion = (props: any) => {
  const [homeOnlineDeliveryData, setHomeOnlineDeliveryData] =
    useState<any>(null);
  const router = useRouter();
  const onClick = (event: any, link: any) => {
    // console.log(link);
    event.preventDefault();
    if (link) {
      router.push(link);
    } else {
      router.push("/coming-soon"); // Assuming '/coming-soon' is the route for the coming soon page
    }
  };
  useEffect(() => {
    setHomeOnlineDeliveryData(props.onlineDeliveryData || []);
  }, [props.onlineDeliveryData]);
  // console.log('homeOnlineDeliveryData ===>>>', homeOnlineDeliveryData);


  return (
    <section className="shop-by-occasion-section delivery w-full">
      <div className="container-fluid">
        <h1 className="section-title">ONLINE FLOWERS DELIVERY INDONESIA</h1>
        <div className="row">
          {homeOnlineDeliveryData?.map((item: any, index: number) => (
            <div className="col-xl-3 col-lg-3 col-6" key={index}>
              <a
                onClick={(event) => onClick(event, item?.link)}
                className="cursor-pointer"
              >
                <img
                  width="369"
                  height="271"
                  className="img-fluid w-100 "
                  src={item?.url}
                  title="Online Flower Delivery"
                  alt={`image-${(<span>{item?.seq}</span>)}`}
                  loading="lazy"
                />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { HomeShopByOccasion };
