import React, { memo, useEffect, useState } from "react";
import { RenderStar } from '@components/shared'
interface PropType {
  rating: string;
  title: string;
  user?: string;
  date: string;
  review: string;
  id: string;
}

function ReviewBox({ id, rating, title, review, user, date }: PropType) {
  const [smReview, setSmReview] = useState('')
  const [smTitle, setSmTitle] = useState('')
  useEffect(() => {
    if (review.length > 80) {
      const _review = review.substring(0, 75) + "...";
      setSmReview(_review);
    } else {
      setSmReview(review);
    }

    if (title.length > 30) {
      const _title = title.substring(0, 28) + "...";
      setSmTitle(_title);
    } else {
      setSmTitle(title);
    }
    return () => {
      setSmReview("");
    };
  }, [review, title]);

  return (
    <div className="review-box flex flex-col px-4 py-4 border justify-center gap-4 mt-4">
      <div className="review-box__header mt-2">{smTitle}</div>
      <RenderStar key={id} review={rating} />
      <div className="h-12">{smReview}</div>
      <div className="flex flex-col justify-content-end review-box__footer">
        <span>- {user || "Anonymous User"}</span>
        <span>{date}</span>
      </div>
    </div>
  );
}

export default memo(ReviewBox);
