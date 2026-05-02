import { getCDNURL } from "@utils/productHelper";
import { useRouter } from "next/router";
import React, { useState, useEffect } from 'react';
import { Carousel } from "react-bootstrap";

const HomeTopSlider = (props: any) => {
  const [homeBannerSliderData, setHomeBannerSliderData] = useState<any>(null);
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
    setHomeBannerSliderData(props.bannerSliderData || []);
  }, [props.bannerSliderData]);

  return (
    <section className="relative w-full h-[80vh] min-h-[600px] overflow-hidden bg-beige">
      {/* Background Slider */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <Carousel fade controls={false} indicators={false} interval={5000} className="w-full h-full">
          {homeBannerSliderData?.map((item: any, index: number) => (
            <Carousel.Item key={index} className="w-full h-full">
              <div 
                className="w-full h-[80vh] min-h-[600px] bg-cover bg-center bg-no-repeat transition-transform duration-[10000ms] ease-linear hover:scale-105"
                style={{ backgroundImage: `url(${getCDNURL(item?.url)})` }}
              />
            </Carousel.Item>
          ))}
        </Carousel>
      </div>

      {/* Elegant Soft Overlay */}
      <div className="absolute inset-0 z-10 bg-black/30 backdrop-blur-[2px]"></div>

      {/* Content */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
        <span className="text-white/90 text-sm md:text-base uppercase tracking-[0.3em] font-sans mb-4">
          Premium Floral Design
        </span>
        <h1 className="text-white text-5xl md:text-7xl font-serif font-medium mb-6 drop-shadow-lg max-w-4xl leading-tight">
          Express Your Emotions with Elegance
        </h1>
        <p className="text-white/90 text-lg md:text-xl font-sans mb-10 max-w-2xl font-light">
          Same-day delivery of luxurious, hand-crafted bouquets across Indonesia.
        </p>
        <button 
          onClick={(e) => onClick(e, '/products')}
          className="bg-white text-charcoal hover:bg-blush hover:text-charcoal transition-all duration-300 font-sans font-medium uppercase tracking-wider py-4 px-10 rounded-none shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
        >
          Shop Collection
        </button>
      </div>
    </section>
  );
};

export { HomeTopSlider };