import React, { useEffect } from "react";
import Layout from "../layouts/Main";
import { useSelector } from 'react-redux';
import { RootState } from "store";
import {
  HomeTopSlider,
  HomePromotions,
  HomeShopByOccasion,
  HomeNewArrivals,
  HomeBestSellers,
  HomeOnlyRoses,
  HomeOnlyCakes,
  HomeOnlyFlowerBox,
  HomeSameDayDelivery,
  HomePageContent,
  HomeReviews,
  MidNightDeliveryBanner,
  HomeOnlyLuxuryFlowers,
  HomePlantsBanner,
  HomeCategories,
  HomeSpecialDeals,
  HomeFlowersCombo,
} from "../components/home";
import ProductCollections from '../components/product-collections';
import { OfferPopup } from "@components/shared";

const IndexPage = () => {
  const { footerData } = useSelector((state: RootState) => state.cms);
  const { homePageContent } = useSelector((state: RootState) => state.cms);
  const metaDesc =
    "Send same-day fresh flowers delivery anywhere in Indonesia for birthday and Anniversary. Order flowers, bouquets, chocolates, and gifts online in Jakarta and Bali. To make every occasion special.";
  const metaKeywords =
    "flowers indonesia, flower delivery in indonesia, florist in indonesia";

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [footerData, homePageContent]);

  return (
    <Layout
      title="Flower Delivery Indonesia | Online Florist | Send Flowers to Jakarta, Bali"
      description={metaDesc}
      keywords={metaKeywords}
    >
      <main className="home-page">
        <HomeTopSlider
          bannerSliderData={homePageContent?.["payload"]?.["banner"]}
        />
        <HomePromotions
          promotionsData={homePageContent?.["payload"]?.["promotions"]}
        />
        <HomeShopByOccasion
          onlineDeliveryData={
            homePageContent?.["payload"]?.["onlineDeliverySection"]
          }
        />
        <HomeNewArrivals
          newArrivalsData={homePageContent?.["payload"]?.["newArrivalSection"]}
          newArrivalsVideoData={
            homePageContent?.["payload"]?.["newArrivalSectionVideo"]
          }
        />
        <HomeBestSellers
          bestSellerData={homePageContent?.["payload"]?.["bestSellersSection"]}
        />
        <HomeOnlyRoses
          showBanner={true}
          onlyRosesData={homePageContent?.["payload"]?.["onlyRoses"]}
        />
        <HomeOnlyCakes
          showBanner={false}
          onlyCakesData={homePageContent?.["payload"]?.["onlyCakes"]}
        />
        <MidNightDeliveryBanner />
        <HomeOnlyFlowerBox
          showBanner={false}
          onlyFlowerBoxData={homePageContent?.["payload"]?.["onlyFlowerBox"]}
        />
        <HomeOnlyLuxuryFlowers
          showBanner={false}
          onlyLuxuryFlowersData={
            homePageContent?.["payload"]?.["onlyLuxuryFlower"]
          }
        />
        <HomePlantsBanner />
        <HomeCategories
          categoriesData={homePageContent?.["payload"]?.["categoriesSection"]}
        />
        <section className="deals-combo mt-4">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-6">
                <HomeSpecialDeals
                  specialDealData={
                    homePageContent?.["payload"]?.["specialDeal"]
                  }
                />
              </div>
              <div className="col-lg-6">
                <HomeFlowersCombo
                  flowersComboData={
                    homePageContent?.["payload"]?.["flowerCombo"]
                  }
                />
              </div>
            </div>
          </div>
        </section>
        <HomeSameDayDelivery
          sameDayDeliveryData={homePageContent?.["payload"]?.["sdd"]}
        />
        <HomePageContent
          pageContentData={homePageContent?.["payload"]?.["content"]}
        />
        <HomeReviews />

        <ProductCollections />
      </main>
      <div className="d-flex flex-wrap align-items-center">
        <OfferPopup />
      </div>
    </Layout>
  );
}


export default IndexPage;