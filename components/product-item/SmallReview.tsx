import React, { memo } from 'react'
import { FaStar } from "react-icons/fa";

interface PropTypes {
  name: string;
  rating: string;
  reviewCount: string;
}

function SmallReview({ name, rating = '0.0', reviewCount='0' }: PropTypes) {
  return (
    <div className="row">
      <div className="col-md-8"><h2>{name}</h2></div>
      <div className="col-md-4 text-right flex items-center justify-end gap-2">
        <FaStar /> {rating || '0.0'}({reviewCount || 'No'} reviews)
      </div>
    </div>
  );
}

export default memo(SmallReview)
