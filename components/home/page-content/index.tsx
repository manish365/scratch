import React, { useState, useEffect } from 'react';

const HomePageContent = (props: any) => {
  const [homePageContentData, setHomePageContentData] = useState<any>(null);

  useEffect(() => {
    setHomePageContentData(props.pageContentData || []);
  }, [props.pageContentData]);

  return (
    <section className="page-content-section desktop-view">
      <div className="container-fluid">
        <div className="page-content-txt">
          <div className="panel-body">
            <div className="rightim">
              <img
                className="first-img-f img-fluid"
                src="/images/footer-i-3.jpg"
                loading="lazy"
                alt="Footer Images"
              />
            </div>
            <div dangerouslySetInnerHTML={{ __html: homePageContentData?.top }} />
            <div className="left-im">
              <img
                className="first-img-f img-fluid"
                src="/images/footer-i-2.jpg"
                loading="lazy"
                alt="Footer Images"
              />
            </div>
            <div dangerouslySetInnerHTML={{ __html: homePageContentData?.middle }} />
            <div className="rightim">
              <img
                className="first-img-f img-fluid"
                src="/images/footer-3.png"
                loading="lazy"
                alt="Footer Images"
              />
            </div>
            <div dangerouslySetInnerHTML={{ __html: homePageContentData?.bottom }} />
          </div>
        </div>
      </div>
    </section>
  );
};

export { HomePageContent };
