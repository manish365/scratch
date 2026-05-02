import React from 'react'
import HomeBanner from "./HomeBanner";
import OnlyProductSection from "./OnlyProductSection";

interface PropTypes {
  showBanner: boolean;
  onlyLuxuryFlowersData: any
}

interface LeftBannerType {
  link: string;
  smImage: string;
  bigImage: string;
  title: string;
  subTitle?: string;
};
interface Products {
  _id: string | number,
  seq: number,
  isActive: boolean,
  name: string,
  price: string,
  productId: string,
  url: string
};

function HomeOnlyLuxuryFlowers({ showBanner, onlyLuxuryFlowersData }: PropTypes) {
  const action = { 
    btnText: "Order Now", 
    link: onlyLuxuryFlowersData?.order
  };

  const _products: Products[] = onlyLuxuryFlowersData?.products;
  const leftBanner: LeftBannerType = {
    link:  onlyLuxuryFlowersData?.banner?.link,
    smImage: onlyLuxuryFlowersData?.banner?.url,
    bigImage: onlyLuxuryFlowersData?.banner?.url,
    title: onlyLuxuryFlowersData?.banner?.title,
    subTitle: onlyLuxuryFlowersData?.banner?.subTitle,
  };
  return (
    <>
      <section className="only-rose-section">
        {showBanner && (
          <div className="container-fluid">
            <HomeBanner
              imgSrc={"/images/roses-collection.webp"}
              imgSrcMobile={"/images/roses-collection-mobile.webp"}
              imgAlt="Roses Delivery"
              title="Only Roses.."
              subTitle="Express Your Love With Roses.."
              action={action}
            />
          </div>
        )}
      </section>
      <OnlyProductSection _products={_products} leftBanner={leftBanner} exploreMore={onlyLuxuryFlowersData?.explore} />
    </>
  );
}

export default HomeOnlyLuxuryFlowers
