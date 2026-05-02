import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store";
import Layout from "../layouts/Main";
import GenericCMSPageContent from "@components/shared/GenericCMSPageContent";

function TermAndConditionsPage() {
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
    "FlowersChamp's terms and conditions ensure transparency, outlining guidelines for orders, payments, refunds, and privacy to protect customer rights.";
  const metaKeywords = "term and conditions, flowers champ, flowers indonesia";

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
      title="Term and Conditions | FlowersChamp Indonesia"
      description={metaDesc}
      keywords={metaKeywords}
    >
      <GenericCMSPageContent noDataText={noDataText} cmsData={cmsData} />
    </Layout>
  );
}

export default TermAndConditionsPage;
