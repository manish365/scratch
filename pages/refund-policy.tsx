import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { useRouter } from "next/router";
import Layout from "../layouts/Main";
import GenericCMSPageContent from "@components/shared/GenericCMSPageContent";

function RefundPolicyPage() {
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
    "FlowersChamp offers a hassle-free refund policy, ensuring customer satisfaction with quick processing for damaged or unsatisfactory orders.";
  const metaKeywords =
    "refund policy, hassle free refund, flowers champ, flowers indonesia";

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
      title="Refund Policy | FlowersChamp Indonesia"
      description={metaDesc}
      keywords={metaKeywords}
    >
      <GenericCMSPageContent noDataText={noDataText} cmsData={cmsData} />
    </Layout>
  );
}

export default RefundPolicyPage;
