import React, { useState, useEffect } from "react";
import { Carousel } from "react-bootstrap";
import { FaStar, FaStarHalf } from "react-icons/fa";

const HomeReviewSlider = (props: any) => {
  const [reviewData, setReviewData] = useState<any>([]);

  useEffect(() => {
    setReviewData(props.reviewData || []);
  }, [props.reviewData]);
  
  const renderRatingStars = (rating: any) => {
    const stars = [];
    const integerPart = Math.floor(rating);
    const decimalPart = rating - integerPart;

    // Render full stars
    for (let i = 0; i < integerPart; i++) {
      stars.push(<FaStar key={i} className="colr" />);
    }

    // Render half star if there's a decimal part
    if (decimalPart > 0) {
      stars.push(<FaStarHalf key={stars.length} className="colr" />);
    }

    return stars;
  };

  return (
    <section className="slider-review-section">
      <div className="container-fluid">
        {/* Mobile View */}
        <Carousel className="review-slider row mobile-view">
          {reviewData?.map((item: any, index: number) => (
            <Carousel.Item key={index}>
              <div className="row">
                <div className="col-md-4 col-sm-12 col-xs-12">
                  <div className="review-col">
                    <div className="review-rating">
                      {renderRatingStars(item?.rating)}
                    </div>
                    <p>{item?.review}</p>
                    <div className="name-section">
                      <div className="buyer-name">
                        <span>Buyer Name : </span>
                        {item?.name}
                      </div>
                      <div className="order-on">
                        <span>Order On : </span>
                        {new Date(item?.createdAt)?.toLocaleDateString(
                          "en-GB",
                          { day: "numeric", month: "short", year: "numeric" }
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>

        {/* Desktop View */}
        <Carousel className="review-slider row desktop-view">
          {reviewData?.reduce((acc: any, item: any, index: number) => {
              if (index % 3 === 0) {
                acc.push([]);
              }
              acc[acc.length - 1].push(item);
              return acc;
            }, [])
            .map((group: any, index: number) => (
              <Carousel.Item key={index}>
                <div className="row">
                  {group.map((item: any, index: number) => (
                    <div key={index} className="col-md-4 col-sm-12 col-xs-12">
                      <div className="review-col">
                        <div className="review-rating">
                          {renderRatingStars(item?.rating)}
                        </div>
                        <p>{item?.review}</p>
                        <div className="name-section">
                          <div className="buyer-name">
                            <span>Buyer Name : </span>
                            {item?.name}
                          </div>
                          <div className="order-on">
                            <span>Order On : </span>
                            {new Date(item?.createdAt)?.toLocaleDateString(
                              "en-GB",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Carousel.Item>
            ))}
        </Carousel>
      </div>
    </section>
  );
};

export default HomeReviewSlider;
