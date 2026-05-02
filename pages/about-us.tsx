import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { useRouter } from "next/router";
import Layout from "../layouts/Main";
import GenericCMSPageContent from "@components/shared/GenericCMSPageContent";

function AboutUsPage() {
  const router = useRouter();
  const currentUrl = router.asPath;
  const currentUrlDataSplit = currentUrl.split("/").pop();

  const { footerContentData }: any = useSelector(
    (state: RootState) => state.cms
  );
  const [cmsData, setCmsData] = useState<any>([]);
  const [noDataText, setNoDataText] = useState(
    "Please wait while fetching your data..."
  );
  let filterData: any;
  const metaDesc =
    "FlowersChamp Indonesia provides fresh flowers, bouquets, and gifts for all occasions with same-day delivery across Indonesia, including Jakarta and Bali. Perfect for any celebration.";
  const metaKeywords =
    "flowers indonesia, flower delivery in indonesia, florist in indonesia";

  useEffect(() => {
    if (footerContentData?.success) {
      filterData = footerContentData?.["results"]?.filter(
        (item: any) => item.seoUrl === currentUrlDataSplit
      );
      setCmsData(filterData);
    } else {
      setNoDataText("No data");
    }
  }, [footerContentData]);

  return (
    <Layout
      title="About Us | Flowerschamp Indonesia"
      description={metaDesc}
      keywords={metaKeywords}
    >
      <GenericCMSPageContent noDataText={noDataText} cmsData={cmsData} />
    </Layout>
  );
}

export default AboutUsPage;
