import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { useRouter } from "next/router";
import Layout from "../layouts/Main";
import GenericCMSPageContent from "@components/shared/GenericCMSPageContent";

function ContactUsPage() {
  const router = useRouter();
  const currentUrl = router.asPath;
  const currentUrlDataSplit = currentUrl.split("/").pop();

  const metaDesc =
    "Reach out to FlowersChamp Indonesia via phone, email, or whatsapp chat for assistance with orders and inquiries.";
  const metaKeywords = "contact us,  flowers champ, flowers indonesia";


  const { footerContentData }: any = useSelector(
    (state: RootState) => state.cms
  );
  const [cmsData, setCmsData] = useState<any>([]);
  const [noDataText, setNoDataText] = useState(
    "Please wait while fetching your data..."
  );
  let filterData: any;

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
      title="Contact With Us | FlowersChamp Indonesia"
      description={metaDesc}
      keywords={metaKeywords}
    >
      <GenericCMSPageContent noDataText={noDataText} cmsData={cmsData} />
    </Layout>
  );
}

export default ContactUsPage;
