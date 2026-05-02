import React, { useEffect, useState } from "react";
import Layout from "../../layouts/Main";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { useRouter } from "next/router";

const CMSPage = () => {
  const router = useRouter();
  const { page } = router.query;
  const currentUrl = router.asPath;
  console.log("currentUrl===>>>", currentUrl);
  const currentUrlDataSplit = currentUrl.split("/");
  console.log("currentUrlDataSplit===>>>", currentUrlDataSplit);

  const { footerContentData }: any = useSelector(
    (state: RootState) => state.cms
  );
  // console.log('footerContentData in HomePage index===>>>', footerContentData);
  let filterData: any;
  if (footerContentData?.success) {
    filterData = footerContentData?.["results"]?.filter(
      (item: any) => item.seoUrl === currentUrlDataSplit[2]
    );
  }
  // console.log('filterData====>>>', filterData);

  const [cmsData, setCmsData] = useState<any>([]);
  const [noDataText, setNoDataText] = useState(
    "Please wait while fetching your data..."
  );

  useEffect(() => {
    console.log("page data===>>>", page);
    if (page) {
      if (filterData.length > 0) {
        // let filterData = footerContentData?.['results']?.filter((item: any) => item.seoUrl === currentUrlDataSplit[2]);
        setCmsData(filterData);
      } else {
        if (filterData.length === 0 && cmsData.length === 0) {
          setNoDataText("No Data Found !!");
        }
      }
    }
  }, [page]);

  return (
    <Layout>
      <section className="d-flex flex-wrap col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 col-12 align-items-center justify-content-start p-0 m-0">
        <div className="container-fluid">
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 align-items-center p-0 m-0">
            <div className="d-flex flex-wrap">
              <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 align-items-center justify-content-center p-0 m-0">
                {cmsData.length > 0 ? (
                  <div className="d-flex flex-wrap col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 align-items-center py-2">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 align-items-center pt-1 mt-1">
                      {cmsData[0]?.metaTitle}
                    </div>

                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 align-items-center justify-content-center mt-1">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: cmsData[0]?.content,
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="d-flex flex-wrap col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 align-items-center py-2 mt-3 pt-3">
                    <h2>{noDataText}</h2>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CMSPage;
