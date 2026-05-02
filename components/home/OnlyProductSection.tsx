import React, { useEffect, useState } from "react";
import OnlyProductExploreButton from './OnlyProductExploreButton'
import OnlyProductCard from './OnlyProductCard'

interface ProductType {
  _id: string | number,
  seq: number,
  isActive: boolean,
  name: string,
  price: string,
  productId: string,
  url: string
}

interface LeftBannerType {
  link: string;
  smImage: string;
  bigImage: string;
  title: string;
  subTitle?: string;
}

interface PropTypes {
  _products: ProductType[];
  leftBanner: LeftBannerType;
  exploreMore: any
}

function OnlyProductSection({ _products, leftBanner, exploreMore }: PropTypes) {
  const [products, setProducts] = useState<ProductType[]>([]);
  useEffect(() => {
    setProducts(_products);
    
    return () => {
      setProducts([]);
    };
  }, [_products]);

  return (
    <section className="flowers">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-5 mb-4 mb-lg-0">
            <a href={leftBanner?.link} className="left-col">
              <img
                height="702"
                className="img-fluid desktop-view w-100"
                src={leftBanner?.bigImage}
                title={`${leftBanner?.title} ${leftBanner?.subTitle}`}
                alt={`${leftBanner?.title} ${leftBanner?.subTitle}`}
                loading="lazy"
              />
              <img
                height="285"
                className="mobile-view img-fluid w-100"
                src={leftBanner.smImage}
                title={`${leftBanner.title} ${leftBanner.subTitle}`}
                alt={`${leftBanner.title} ${leftBanner.subTitle}`}
                loading="lazy"
              />
              {false && (
                <div className="col-text black-text">
                  <h3>{leftBanner.title}</h3>
                  <h4>{leftBanner.subTitle}</h4>
                </div>
              )}
            </a>
          </div>
          <div className="col-lg-7">
            <div className="row mob-row">
              {products?.slice(0, 6)?.map((p: ProductType) => (
                <div className="col-md-4 col-6" key={p._id}>
                  <OnlyProductCard
                    key={p.productId}
                    _id={p._id}
                    image={p.url}
                    name={p.name}
                    price={p.price}
                    productId={p.productId}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <OnlyProductExploreButton href={exploreMore} />
      </div>
    </section>
  );
}

export default OnlyProductSection;
