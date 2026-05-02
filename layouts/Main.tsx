import React, { useEffect } from "react";
import Head from "next/head";
import Header from "components/header";
import Footer from "components/footer";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { AppDispatch } from "store";
import {
  fetchFooterData,
  fetchFooterContentData,
  fetchWebsiteMeta,
  fetchWebsiteCmsData,
} from "store/reducers/cms";
import { fetchReviewData } from "store/reducers/review";
import { fetchMenuCMSContent, fetchMenuData } from "store/reducers/menu";

type LayoutType = {
  title?: string;
  description?: string;
  keywords?: string;
  children?: React.ReactNode;
  hideScroll?: boolean;
  onScroll?: any;
};

export default ({
  children,
  title = "Flower Champ",
  description = "",
  keywords = "",
  hideScroll = false,
}: LayoutType) => {
  const router = useRouter();
  const pathname = router.pathname;
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // TODO
    // Group all the API to a single one to reduce load time
    dispatch(fetchFooterData());
    dispatch(fetchFooterContentData());
    dispatch(fetchWebsiteMeta());
    dispatch(fetchWebsiteCmsData());
    dispatch(fetchReviewData());
    dispatch(fetchMenuData());
    dispatch(fetchMenuCMSContent());

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    }); // Scrolls to the top of the page
  }, [dispatch]);

  return (
    <div className="app-main" id="app-main">
      <Head>
        <title>{title || "Flower Champ | Send Flowers Indonesia"}</title>
        <meta
          name="description"
          content={
            description ||
            "Same-day flower delivery anywhere in Indonesia. Send Birthday & Anniversary flowers online in Indonesia. Browse through a plethora of gifts. Order now!"
          }
        />
        <meta
          name="keywords"
          content={
            keywords ||
            "flowers indonesia, flower delivery in indonesia, florist in indonesia"
          }
        />
        <meta
          property="og:title"
          content="Online Same-Day Flower Delivery | Send Flowers Indonesia"
        />
        <meta
          property="og:description"
          content="Same-day flower delivery anywhere in Indonesia. Send Birthday & Anniversary flowers online in Indonesia. Browse through a plethora of gifts. Order now!"
        />
        <meta property="og:url" content="https://www.flowerschamp.com/" />
        <meta
          name="twitter:title"
          content="Online Same-Day Flower Delivery | Send Flowers Indonesia"
        />
        <meta
          name="twitter:description"
          content="Same-day flower delivery anywhere in Indonesia. Send Birthday & Anniversary flowers online in Indonesia. Browse through a plethora of gifts. Order now!"
        />
      </Head>

      <Header />

      <main
        className={`${pathname !== "/" ? "main-page" : ""} ${
          hideScroll ? "overflow-y-hidden" : ""
        }`}
      >
        {children}
      </main>

      <Footer />
    </div>
  );
};
