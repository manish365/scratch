import React from "react";
import HomeReviewSlider from "../review-slider";
import { useSelector } from 'react-redux';
import { RootState } from "store";

const HomeReviews = () => {
  const { reviewData }: any = useSelector((state: RootState) => state.review);

  return (
    <section className="review-section">
      <div className="container-fluid">
        <div className="row btm-ck">
          <div className="col-xl-12 col-lg-12 col-md-12">
            <div className="br-btm">
              <div className="cake-hed pull-left">Indonesia Reviews</div>
            </div>
          </div>
        </div>

        <div className="shop-by reviews">
        {reviewData && <HomeReviewSlider reviewData={reviewData} />}
        </div>
      </div>
    </section>
  );
};

export { HomeReviews };
