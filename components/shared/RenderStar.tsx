import React, { useEffect, useState } from "react";
import { BsStarFill, BsStarHalf, BsStar } from "react-icons/bs";

function RenderStar({ review }: { review: string }) {
  const [fullStar, setFullStar] = useState<number>(0);
  const [halfStar, setHalfStar] = useState<number>(0);
  const [blankStar, setBlankStar] = useState<number>(0);

  useEffect(() => {
    let _halfStarCount = 0
    const _fullStar = +review.split(".")[0];
    setFullStar(_fullStar);

    const _halfStar = +review.split(".")[1] || 0;
    if (_halfStar > 0) {
      setHalfStar(1);
      _halfStarCount = 1;
    }

    const _blankStar = 5 - (_fullStar + _halfStarCount);
    if (_blankStar > 0) {
      setBlankStar(_blankStar);
    }
      return () => {
        setFullStar(0);
        setHalfStar(0);
        setBlankStar(0);
      };
  }, [setFullStar]);

  return (
    <div className="flex items-center review-box__star">
      {new Array(fullStar).fill(0).map((_fs, index) => (
        <BsStarFill key={`full-star-${index}`} />
      ))}

      {new Array(halfStar).fill(0).map((_hs, index) => (
        <BsStarHalf key={`half-star-${index}`} />
      ))}

      {new Array(blankStar).fill(0).map((_bs, index) => (
        <BsStar key={`blank-star-${index}`} />
      ))}
    </div>
  );
}

export default RenderStar;
