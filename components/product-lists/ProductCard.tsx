import { getExchageRateFromState } from '@utils/localstorage';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { AiFillStar } from 'react-icons/ai'

interface PropTypes {
  product: any;
}

function ProductCard({ product }: PropTypes) {
  const router = useRouter()
  const [realPrice, setRealPrice] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [currentPriceUSD, setCurrentPriceUSD] = useState(0);
  const [showRealPrice, setShowRealPrice] = useState(true);
  const [deliveryInfo, setDeliveryInfo] = useState('Today');
  const [extraTags, setExtraTags] = useState<any>([]);
  const [statusHotOffer, setStatusHotOffer] = useState<boolean>(false);
  const [imageSrc, setImageSrc] = useState<string>('');
  const currentRate = getExchageRateFromState();

  useEffect(() => {
    if (product) {
      const { realPrice, currentPrice } = product.countryPrice?.price?.standard;

      const { deliveryFrequency } = product.delivery;
      if (realPrice) {
        setRealPrice(+realPrice)
      }
      if (currentPrice) {
        setCurrentPrice(+currentPrice);
        const usdPrice = +currentPrice / +currentRate;
        setCurrentPriceUSD(usdPrice);
      }
      
      setShowRealPrice(+currentPrice < +realPrice);

      if (deliveryFrequency === "SAMEDAY") {
        setDeliveryInfo("Today");
      } else if (deliveryFrequency === "NEXTDAY") {
        setDeliveryInfo("Tomorrow");
      } else {
        setDeliveryInfo("Day After Tomorrow");
      }

      // if already 5PM then earliest delivery will be nestday
      const currentHour = new Date().getHours()
      if (+currentHour >= 17 && deliveryFrequency === "SAMEDAY") {
        setDeliveryInfo("Tomorrow");
      }

      if(product?.extraTags.length && product?.extraTags[0]?.name !== null) {
        setExtraTags(product?.extraTags);
      } else {
        setExtraTags([]);
      }

      if(product?.statusHotOffer) {
        setStatusHotOffer(true);
      }

      if (product.image?.thumb) {
        setImageSrc(product.image?.thumb);
      } else {
        setImageSrc(product.image?.default);
      }
    }
    return () => {
      setRealPrice(0);
      setCurrentPrice(0);
      setCurrentPriceUSD(0);
      setShowRealPrice(false);
    };
  }, [setRealPrice, product, setExtraTags, setStatusHotOffer]);

  const onBuyNowLink = () => {
    router.push(`/products/details/${product._id}`);
  };

  const onImageLoadError = () => {
    console.log('error');
    setImageSrc(
      "https://placehold.co/305x305/c4c7cd/0b111e?text=FlowersChamp.com&font=Playfair%20Display"
    );
  }

  return (
    <div
      className="group flex flex-col w-full h-full bg-white rounded-md overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500"
      onClick={onBuyNowLink}
    >
      {/* Image Container */}
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-beige">
        <Image
          src={imageSrc}
          alt={product.name}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-700 ease-in-out group-hover:scale-110"
          loading="lazy"
          loader={() => imageSrc}
          placeholder="blur"
          blurDataURL={
            "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCACJAIkDASIAAhEBAxEB/8QAGgAAAwEBAQEAAAAAAAAAAAAAAgMEAQAFBv/EABsQAQEBAQEBAQEAAAAAAAAAAAABAgMRMSFB/8QAFwEBAQEBAAAAAAAAAAAAAAAAAgEDAP/EABgRAQEBAQEAAAAAAAAAAAAAAAABAjER/9oADAMBAAIRAxEAPwD7NznJXBvxP1UX4m6sqUR9UfRZ1R9BOEVuWV2XQj8KcJsKMHHKMmwrJsIWsrQ1RoNF6M0VpRoK51Y4Xtsax1Vmvibqo18TdWVKI+qPor6o+lQ4Ta7NDqtzXGoxVGKlxVOKSKcmQnFNlIaMNrvWWqNDorVHqlaqjWWs9Zaz1Re8xrBqh38Sdaq38SdaBxH1qPpVfaoutcUJ1W5oNX9dmu8aKedU4qTnVPOqlVYpkpOKZK4KZ6G13obVGh1StUeqVqkFZaz1lrPVR9C5zqFIvpUfWqulR9aJRJ2qLrVfaoetI4TquzQ6v67FVqr51VzqPnVfMQqnFNlJwZEZ0fobXB1VCg1SdUzVJ1Tg0NrPQ2s9IX1oNUQN1gcI6VH1qrpUfaqcR9qg7Vb2qDtSjTKfV/W4per+j51Wyvkr5o+SvmLKqcGwnBsczrQ6FQaUKVuk6puyN0oNBaz1lofSF9hS9jpe2DQjoj7VX0RdlKIu1+oO1Xdq8/tVa5Tav6PmXq/pnNW14s5K+aTkr5ox0owbC8GRzKuoNDoNKNJ2Rs7ZGyg0rVD63QSF9lStmUvbBon6Iuy3oi7OKIO39ef2eh2/rz+zmuUt+ncib9O5LGt4t5LOaPks5qw0owZC8mxWdZQaMpenDSNptqdptkJOgi0FUf/9k="
          }
          onError={onImageLoadError}
        />
        
        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button className="bg-white/95 backdrop-blur-sm text-charcoal font-sans text-sm font-medium tracking-widest uppercase px-6 py-3 rounded-none shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-primary hover:text-white">
            Quick View
          </button>
        </div>

        {/* Badges */}
        {extraTags.length > 0 && (
          <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
            <span className="bg-primary/90 text-white text-xs font-sans tracking-wide uppercase px-2 py-1 shadow-sm">
              {extraTags.map((item: any) => item?.name)?.join(", ")}
            </span>
          </div>
        )}
        
        {statusHotOffer && (
          <div className="absolute top-2 right-2 z-10">
            <img
              src="https://www.probunga.com/assets/template/templateprobunga/image/hot-offers.png"
              alt="hot offer"
              width="90"
              height="21"
              className="drop-shadow-sm"
            />
          </div>
        )}
      </div>

      {/* Product Details Container */}
      <div className="flex flex-col flex-1 p-5 items-center text-center bg-white">
        
        <div className="flex items-center gap-1 text-primary text-sm mb-2">
          <AiFillStar />
          <span className="text-gray-500 text-xs ml-1 font-sans">
            {product.review.rating} ({product.review.count})
          </span>
        </div>
        
        <h2 className="text-lg md:text-xl font-serif text-charcoal mb-2 leading-snug line-clamp-2">
          {product.name}
        </h2>
        
        <div className="flex flex-wrap items-center justify-center gap-2 mb-3 mt-auto">
          {showRealPrice && (
            <span className="text-gray-400 line-through text-sm font-sans">
              IDR {(+realPrice)?.toFixed(2)}
            </span>
          )}
          <span className="text-charcoal font-medium text-base font-sans">
            IDR {(+currentPrice)?.toFixed(2)}
          </span>
          <span className="text-gray-300 text-sm hidden md:inline">|</span>
          <span className="text-gray-500 text-sm font-sans">
            $ {(+currentPriceUSD)?.toFixed(2)}
          </span>
        </div>
        
        <p className="text-xs text-gray-500 uppercase tracking-wider font-sans border-t border-blush pt-3 w-full">
          Earliest Delivery:{" "}
          <span className="font-semibold text-primary">{deliveryInfo}</span>
        </p>
      </div>
    </div>
  );
}

export default ProductCard
