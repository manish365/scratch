import React from 'react'
import HomeBanner from './HomeBanner'
import OnlyProductSection from './OnlyProductSection'

interface PropTypes {
  showBanner: boolean;
  onlyCakesData: any
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

function HomeOnlyCakes({ showBanner, onlyCakesData }: PropTypes) {
  const action = { 
    btnText: "Order Now",
    link: onlyCakesData?.order
  };
  const _products: Products[] = onlyCakesData?.products;
  const leftBanner: LeftBannerType = {
    link:  onlyCakesData?.banner?.link,
    smImage: onlyCakesData?.banner?.url,
    bigImage: onlyCakesData?.banner?.url,
    title: onlyCakesData?.banner?.title,
    subTitle: onlyCakesData?.banner?.subTitle,
  };
  return (
    <>
      <section className="only-rose-section mb-4">
        {showBanner && (
          <div className="container-fluid">
            <HomeBanner
              imgSrc={"/images/roses-collection.webp"}
              imgSrcMobile={"/images/roses-collection-mobile.webp"}
              imgAlt="Cakes Delivery"
              title={onlyCakesData?.title}
              subTitle={onlyCakesData?.subTitle}
              action={action}
            />
          </div>
        )}
      </section>
      <OnlyProductSection _products={_products} leftBanner={leftBanner} exploreMore={onlyCakesData?.explore} />
    </>
  );
}

export default HomeOnlyCakes
