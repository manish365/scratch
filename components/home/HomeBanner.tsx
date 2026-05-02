import { useRouter } from "next/router";
import React from "react";

interface PropTypes {
  imgSrc: string;
  imgSrcMobile?: string;
  imgAlt: string;
  title: string;
  subTitle: string;
  action: {
    btnText: string;
    link: string;
  };
}

function HomeBanner({
  imgSrc,
  imgSrcMobile,
  imgAlt,
  title,
  subTitle,
  action,
}: PropTypes) {
  const router = useRouter();
  const onClickButton = () => {
    router.push(action.link);
  };

  return (
    <button
      className="bx-shadow position-relative w-full"
      onClick={onClickButton}
    >
      <img
        height="62"
        className="desktop-view img-fluid w-100"
        src={imgSrc}
        title={imgAlt}
        alt={imgAlt}
        loading="lazy"
      />
      <img
        height="50"
        className="mobile-view img-fluid w-100"
        src={imgSrcMobile}
        title={imgAlt}
        alt={imgAlt}
        loading="lazy"
      />
      {title && (
        <h4>
          {title}
          {subTitle && <b className="hdi">{subTitle}</b>}
          {action.btnText && <span>{action.btnText}</span>}
        </h4>
      )}
    </button>
  );
}

export default HomeBanner;
