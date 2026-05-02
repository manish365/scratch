import React, { useState } from 'react'
import Layout from "../layouts/Main";
import Breadcrumb from "@components/breadcrumb";
import {Pagination, ReviewBox} from "@components/shared";
import { useDispatch, useSelector } from 'react-redux';
import { ReviewType } from '~types/General';
import { fetchReviewData } from '../store/reducers/review';

function CustomerReview() {
  const dispatch: any = useDispatch();
  const { reviewData } = useSelector((state: any) => state.review);
  const [pageNumber, setPageNumber] = useState(1);
  const [previousButtonDisabled, setPreviousButtonDisabled] = useState(true);

  const metaDesc =
    "FlowersChamp impresses customers with stunning arrangements, reliable deliveries, and top-notch service. Perfect for any special occasion!";
  const metaKeywords =
    "flowers indonesia, flower delivery in indonesia, florist in indonesia, flowers champ, customer review";

  // TODO
  // dispatch the reducer - fetchReviewData(page, 10)
  // with selected page number
  const onUpdatePagination = (e: string) => {
    console.log(e);
    if (e === "previous") {
      setPageNumber(pageNumber - 1);
      if (pageNumber <= 2) {
        setPreviousButtonDisabled(true);
      }
      return;
    }

    if (e === "next") {
      setPageNumber(pageNumber + 1);
      setPreviousButtonDisabled(false);
      return;
    }

    // set the page
    const currentPage = +e;
    if (currentPage > 0) {
      setPageNumber(currentPage);
    }

    // toggle previous button state
    if (currentPage > 1) {
      setPreviousButtonDisabled(false);
    } else {
      setPreviousButtonDisabled(true);
    }

    dispatch(fetchReviewData(currentPage, 10, false));
  };

  return (
    <Layout
      title="Customer Reviews | FlowersChamp Indonesia"
      description={metaDesc}
      keywords={metaKeywords}
    >
      <Breadcrumb mainPath={"Home"} pName={"Customer Reviews"} />
      <div className="container">
        <div className="row">
          {reviewData &&
            reviewData.map((review: ReviewType) => (
              <div className="col-xs-12 col-md-6 col-lg-4" key={review._id}>
                <ReviewBox
                  rating={review.rating}
                  title={review.title}
                  user={review.name}
                  date={review.updatedAt || ""}
                  review={review.review}
                  id={review._id}
                />
              </div>
            ))}
        </div>
        <div className="row">
          <div className="col-md-12 mt-4 justify-center">
            <Pagination
              update={onUpdatePagination}
              page={pageNumber}
              previousButtonDisabled={previousButtonDisabled}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default CustomerReview;
