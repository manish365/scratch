import React from 'react';
import HomeBanner from "../HomeBanner";
import OnlyProductSection from '../OnlyProductSection';

interface PropTypes {
  showBanner: boolean;
  onlyRosesData: any;
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

const HomeOnlyRoses = ({ showBanner, onlyRosesData }: PropTypes) => {
  const action = { 
    btnText: "", 
    link: onlyRosesData?.order
  };

  const _products: Products[] = onlyRosesData?.products;
  const leftBanner: LeftBannerType = {
    link:  onlyRosesData?.banner?.link,
    smImage: onlyRosesData?.banner?.url,
    bigImage: onlyRosesData?.banner?.url,
    title: onlyRosesData?.banner?.title,
    subTitle: onlyRosesData?.banner?.subTitle,
  };
  return (
    <>
      <section className="only-rose-section mb-4">
        {showBanner && (
          <div className="container-fluid">
            <HomeBanner
              imgSrc={"/images/only-roses-banner-sm.webp"}
              imgSrcMobile={"/images/only-roses-banner-sm.webp"}
              imgAlt="Roses Delivery"
              title={onlyRosesData?.title}
              subTitle={onlyRosesData?.subTitle}
              action={action}
            />
          </div>
        )}
      </section>
      <OnlyProductSection _products={_products} leftBanner={leftBanner} exploreMore={onlyRosesData?.explore} />
    </>
  );
};

export { HomeOnlyRoses };
