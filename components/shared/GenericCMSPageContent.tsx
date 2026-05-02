import React from 'react'

function GenericCMSPageContent({
  cmsData,
  noDataText = "Please wait while fetching your data...",
}: {
  cmsData: any;
  noDataText: string;
}) {
  return (
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
  );
}

export default GenericCMSPageContent
