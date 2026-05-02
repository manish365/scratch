import React, { useEffect, useRef, useState } from "react";
import ClassicVariant from "./ClassicVariant";
import DoubleTheQtyVariant from "./DoubleTheQtyVariant";
import PremiumVariant from "./PremiumVariant";
import { getExchageRateFromState } from "utils/localstorage";
import { useDispatch, useSelector } from "react-redux";
import { updateWorkingCart } from "store/reducers/cart";
import { RootState } from "store";
interface PropTypes {
  _product: any;
  city?: string;
  updateVariantEvent: any;
}

function PlantVariants({ _product, updateVariantEvent, city }: PropTypes) {
  const dispatch = useDispatch()
  const { workingCart } = useSelector((store: RootState) => store.cart)
  const [product, _setProduct] = useState(_product);
  const [variant, setVariant] = useState("classic"); // classic | double | three-tier
  const [_selectedVariant, setSelectedVariant] = useState(
    workingCart.variant || "classic"
  );
  const standardPrice = useRef<number>(0);
  const standardPriceUSD = useRef<number>(0);
  const doublePrice = useRef<number>(0);
  const doublePriceUSD = useRef<number>(0);
  const threeTierPrice = useRef<number>(0);
  const threeTierPriceUSD = useRef<number>(0);
  const currentRate = getExchageRateFromState();

  useEffect(() => {
    if (product) {
      // setting up standard price
      updateStandardPrice();

      // checking on variant
      if (product.flowerVarient.double?.fieldOne) {
        // two tier variant
        setVariant("double");
        updateDoublePrice();
        onUpdateVariant(_selectedVariant);
      } else if (product.flowerVarient.threeTier?.fieldOne) {
        // three tier variant
        setVariant("three-tier");
        updateDoublePrice();
        updateThreeTierPrice();
        onUpdateVariant(_selectedVariant);
      } else {
        // set single tier variant as default
        setVariant("classic");
        onUpdateVariant(_selectedVariant);
      }
    }

    return () => {
      setVariant("classic");
    };
  }, [city]);

  const updateStandardPrice = () => {
    if (city) {
      const cityPrice = product.cityPrice.filter((cp: any) => cp._id === city);
      if (cityPrice.length) {
        // console.log(">> price found for city", cityPrice[0].name);
        const _standardPrice = +(
          cityPrice[0]?.price?.standard?.currentPrice ?? 0
        );
        standardPrice.current = _standardPrice;
        const _currentUSDPrice = _standardPrice / +currentRate;
        standardPriceUSD.current = +_currentUSDPrice.toFixed(2);
      } else {
        updateCountryStandardPrice();
      }
    } else {
      updateCountryStandardPrice();
    }
  };

  const updateCountryStandardPrice = () => {
    const _standardPrice = +(
      product.countryPrice?.price?.standard?.currentPrice ?? 0
    );
    standardPrice.current = _standardPrice;
    const _currentUSDPrice = _standardPrice / +currentRate;
    standardPriceUSD.current = +_currentUSDPrice.toFixed(2);
  }

  const updateDoublePrice = () => {
    if (city) {
      const cityPrice = product.cityPrice.filter((cp: any) => cp._id === city);
      if (cityPrice.length) {
        // console.log(">> double price found for city", cityPrice[0].name);
        const _doublePrice = +(
          cityPrice[0]?.price?.doubleTheQty?.currentPrice ?? 0
        );
        doublePrice.current = _doublePrice;
        const doubleUSDPrice = _doublePrice / +currentRate;
        doublePriceUSD.current = +doubleUSDPrice.toFixed(2);
      } else {
        updateCountryDoublePrice();
      }
    } else {
      updateCountryDoublePrice();
    }
  };

  const updateCountryDoublePrice = () => {
    const _doublePrice = +(
      product.countryPrice?.price?.doubleTheQty?.currentPrice ?? 0
    );
    doublePrice.current = _doublePrice;
    const doubleUSDPrice = _doublePrice / +currentRate;
    doublePriceUSD.current = +doubleUSDPrice.toFixed(2);
  };

  const updateThreeTierPrice = () => {
    if (city) {
      const cityPrice = product.cityPrice.filter((cp: any) => cp._id === city);
      if (cityPrice.length) {
        // console.log(">> three tier price found for city", cityPrice[0].name);
        const price = +(cityPrice[0]?.price?.premium?.currentPrice ?? 0);
        threeTierPrice.current = price;
        const USDPrice = price / +currentRate;
        threeTierPriceUSD.current = +USDPrice.toFixed(2);
      } else {
        updateCountryThreeTierPrice();
      }
    } else {
      updateCountryThreeTierPrice();
    }
  };

  const updateCountryThreeTierPrice = () => {
    const price = +(product.countryPrice?.price?.premium?.currentPrice ?? 0);
    threeTierPrice.current = price;
    const USDPrice = price / +currentRate;
    threeTierPriceUSD.current = +USDPrice.toFixed(2);
  };

  const onUpdateVariant = (variant: string) => {
    let _standardPrice = standardPrice.current;
    if (!standardPrice.current) {
      _standardPrice = +(
        product.countryPrice?.price?.standard?.currentPrice ?? 0
      );
    }
    setSelectedVariant(variant);
    updateVariantEvent(variant);
    const vPrice =
      variant === "three-tier"
        ? threeTierPrice.current
        : variant === "double"
        ? doublePrice.current
        : _standardPrice;
    dispatch(
      updateWorkingCart({
        variant,
        price: vPrice,
        city: "",
      })
    );
  };
  return (
    <div className="row mt-4">
      {variant === "classic" && (
        <div className="col-md-8">
          <ClassicVariant
            onUpdateVariant={onUpdateVariant}
            description={product.description}
            price={standardPrice.current}
            priceUSD={standardPriceUSD.current}
            isSelected={_selectedVariant === "classic"}
          />
        </div>
      )}
      {variant === "double" && (
        <>
          <div className="col-md-6">
            <ClassicVariant
              onUpdateVariant={onUpdateVariant}
              description={product.flowerVarient?.double?.fieldOne}
              price={standardPrice.current}
              priceUSD={standardPriceUSD.current}
              isSelected={_selectedVariant === "classic"}
            />
          </div>
          <div className="col-md-6">
            <DoubleTheQtyVariant
              onUpdateVariant={onUpdateVariant}
              description={product.flowerVarient?.double?.fieldTwo}
              price={doublePrice.current}
              priceUSD={doublePriceUSD.current}
              isSelected={_selectedVariant === "double"}
            />
          </div>
        </>
      )}
      {variant === "three-tier" && (
        <>
          <div className="col-md-4">
            <ClassicVariant
              onUpdateVariant={onUpdateVariant}
              description={product.flowerVarient?.threeTier?.fieldOne}
              price={standardPrice.current}
              priceUSD={standardPriceUSD.current}
              isSelected={_selectedVariant === "classic"}
            />
          </div>
          <div className="col-md-4">
            <DoubleTheQtyVariant
              onUpdateVariant={onUpdateVariant}
              description={product.flowerVarient?.threeTier?.fieldTwo}
              price={doublePrice.current}
              priceUSD={doublePriceUSD.current}
              isSelected={_selectedVariant === "double"}
              title="Deluxe"
            />
          </div>
          <div className="col-md-4">
            <PremiumVariant
              onUpdateVariant={onUpdateVariant}
              description={product.flowerVarient?.threeTier?.fieldThree}
              price={threeTierPrice.current}
              priceUSD={threeTierPriceUSD.current}
              isSelected={_selectedVariant === "three-tier"}
              title="Premium"
            />
          </div>
        </>
      )}
    </div>
  );
}

export default PlantVariants;
