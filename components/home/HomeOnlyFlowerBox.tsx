import React from 'react'
import HomeBanner from "./HomeBanner";
import OnlyProductSection from "./OnlyProductSection";

interface PropTypes {
  showBanner: boolean;
  onlyFlowerBoxData: any
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

function HomeOnlyFlowerBox({ showBanner, onlyFlowerBoxData }: PropTypes) {
  const action = { 
    btnText: "Order Now", 
    link: onlyFlowerBoxData?.order
  };

  const _products: Products[] = onlyFlowerBoxData?.products;
  const leftBanner: LeftBannerType = {
    link:  onlyFlowerBoxData?.banner?.link,
    smImage: onlyFlowerBoxData?.banner?.url,
    bigImage: onlyFlowerBoxData?.banner?.url,
    title: onlyFlowerBoxData?.banner?.title,
    subTitle: onlyFlowerBoxData?.banner?.subTitle,
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
              title={onlyFlowerBoxData?.title}
              subTitle={onlyFlowerBoxData?.subTitle}
              action={action}
            />
          </div>
        )}
      </section>
      <OnlyProductSection _products={_products} leftBanner={leftBanner} exploreMore={onlyFlowerBoxData?.explore} />
    </>
  );
}

export default HomeOnlyFlowerBox
