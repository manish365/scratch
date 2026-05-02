import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import Layout from "../layouts/Main";
import GenericCMSPageContent from "@components/shared/GenericCMSPageContent";

function PrivacyPolicyPage() {
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
    "FlowersChamp values your privacy, safeguarding personal information with strict security measures, and never sharing data without your consent.";
  const metaKeywords = "flowers champ, privacy policy, flowers indonesia";

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
      title="Privacy Policy | FlowersChamp Indonesia"
      description={metaDesc}
      keywords={metaKeywords}
    >
      <GenericCMSPageContent noDataText={noDataText} cmsData={cmsData} />
    </Layout>
  );
}

export default PrivacyPolicyPage
