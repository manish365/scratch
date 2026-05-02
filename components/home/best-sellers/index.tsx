import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState, useEffect } from 'react';

const HomeBestSellers = (props: any) => {
  const [homeBestSellerData, setHomeBestSellerData] = useState<any>(null);
  const router = useRouter();
  const onClick = (event: any, link: any) => {
    event.preventDefault();
    if (link) {
      router.push(link);
    } else {
      router.push('/coming-soon');
    }
  }
  useEffect(() => {
    setHomeBestSellerData(props.bestSellerData || []);
  }, [props.bestSellerData]);

  return (
    <section className="py-16 bg-beige">
      {/* Banner Section */}
      <div className="container mx-auto px-4 md:px-8 mb-16">
        <div className="w-full overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-500 cursor-pointer">
          <a onClick={(event) => onClick(event, homeBestSellerData?.banner?.link)} className="block w-full">
            <Image
              width={1550}
              height={275}
              title="Best Sellers Flowers"
              className="hidden md:block w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
              alt="Best Sellers Flowers"
              src={homeBestSellerData?.banner?.url || "/placeholder-banner.jpg"}
              loading="lazy"
            />
            <img
              width="100%"
              height="145"
              title="Best Sellers Flowers"
              className="block md:hidden w-full h-auto object-cover"
              alt="Best Sellers Flowers"
              src={homeBestSellerData?.banner?.url || "/placeholder-banner.jpg"}
              loading="lazy"
            />
          </a>
        </div>
      </div>

      {/* Mid Sections (Icons) */}
      <div className="container mx-auto px-4 md:px-8 mb-16">
        <div className="flex flex-wrap justify-center gap-6 md:gap-12">
          {homeBestSellerData?.midSections?.map((item: any) => (
            <div className="group cursor-pointer flex flex-col items-center text-center" key={item?._id}>
              <a onClick={(event) => onClick(event, item?.link)} className="flex flex-col items-center">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white shadow-sm flex items-center justify-center p-4 mb-4 transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-md border border-blush">
                  <img
                    className="w-full h-full object-contain"
                    src={item?.url}
                    alt={item?.title}
                    title={item?.title}
                    loading="lazy"
                  />
                </div>
                <p className="text-charcoal font-sans text-sm md:text-base font-medium tracking-wide group-hover:text-primary transition-colors">
                  {item?.title}
                </p>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Sections (Grid) */}
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
          {homeBestSellerData?.bottomSections?.map((item: any) => (
            <div className="relative group cursor-pointer overflow-hidden bg-white shadow-sm rounded-sm" key={item?._id}>
              <a
                className="block w-full aspect-[4/5] overflow-hidden"
                onClick={(event) => onClick(event, item?.link)}
              >
                <img
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  src={item?.url}
                  alt={item?.title}
                  title={item?.title}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <span className="text-white font-serif text-lg md:text-xl tracking-wide opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    {item?.title}
                  </span>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { HomeBestSellers };
