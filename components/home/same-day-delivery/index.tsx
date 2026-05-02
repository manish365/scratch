import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";

const HomeSameDayDelivery = (props: any) => {
  const [homeSameDayDeliveryData, setHomeSameDayDeliveryData] =
    useState<any>(null);
  const router = useRouter();
  const onClick = (event: any, link: any) => {
    event.preventDefault();
    if (link) {
      const linkUrl = convertCityUrl(link);
      router.push(linkUrl);
    } else {
      router.push("/coming-soon");
    }
  };
  function convertCityUrl(url: string) {
    let urlParts = url.split("/");
    let cityIndex = urlParts.indexOf("city");

    if (cityIndex !== -1 && cityIndex + 1 < urlParts.length) {
      let lowercasePart = urlParts[cityIndex + 1].toLowerCase();
      let titlecaseString = lowercasePart.replace(/\b\w/g, (char: any) =>
        char.toUpperCase()
      );
      urlParts[cityIndex + 1] = titlecaseString;
      let convertedUrl = urlParts.join("/");
      return convertedUrl;
    } else {
      return url;
    }
  }
  useEffect(() => {
    setHomeSameDayDeliveryData(props.sameDayDeliveryData || []);
  }, [props.sameDayDeliveryData]);

  return (
    <section className="same-day-delivery-section">
      <div className="container-fluid">
        <div className="country-areas">
          <h2 className="title mb-4">{homeSameDayDeliveryData?.title}</h2>
          <div className="row">
            <div className="col-xl-3 col-lg-3 mb-4 mb-lg-0 text-center text-lg-left">
              <img
                src="/images/flug.png"
                className="img-fluid bx-shadow"
                alt="Same day delivery"
                loading="lazy"
              />
            </div>
            <div className="col-xl-9 col-lg-9">
              <ul>
                {homeSameDayDeliveryData?.cities?.map((item: any) => (
                  <li key={item?._id}>
                    <a
                      onClick={(event) => onClick(event, item?.link)}
                      title={item?.title}
                    >
                      {item?.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="border-dot"></div>
      </div>
    </section>
  );
};

export { HomeSameDayDelivery };
