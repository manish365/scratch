import React from "react";
import NextLink from 'next/link'

function OnlyProductExploreButton({ href = '/' }: { href: string; }) {
  // console.log('OnlyProductExploreButton===>>>', href);
  
  return (
    <div className="text-right">
      <NextLink href={href} className="primary-btn">
        Explore More
      </NextLink>
    </div>
  );
}

export default OnlyProductExploreButton;
