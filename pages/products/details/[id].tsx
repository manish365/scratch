import { useEffect, useState } from "react";
import Layout from "../../../layouts/Main";
import Breadcrumb from "../../../components/breadcrumb";
import { useRouter } from "next/router";
import { server } from "../../../utils/server";
import { FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import {
  DeliverInfoTop,
  DeliveryInformation,
  FlowerCareGuide,
  InternationalDeliverySection,
  PlantVariants,
  SmallReview,
  UpgradeOption,
  CakeVariants,
  AddToCartButton,
  AddonModal,
} from "@components/product-item";
import { HomeReviews } from "@components/home";
import useProductCategories from "@hooks/useProductCategories";
import { useDispatch, useSelector } from "react-redux";
import { ProductStoreType } from "~types/index";
import { addProduct, updateCartCity, updateWorkingCartAddons } from "../../../store/reducers/cart";
import useVaseAmount from "@hooks/useVaseAmount";
import useEggLessAmount from "@hooks/useEggLessAmount";
import { validateAddToCartObject } from "../../../utils/add-to-cart-validation";
import { SnackBar, SelectSearch, Loader } from "@components/shared";
import { RootState } from "store";
import { CalendarPopupModal } from "@components/all-dialogs";
import { loadState } from "@utils/localstorage";
import { FiTruck } from "react-icons/fi";
import { PriceHikeDateType } from "~types/General";

interface ProductDetailsMetaType {
  blockDates: any[];
  category: any[];
  deliveryDate: any[];
  deliverySlot: any[];
  hikeDate: any[];
  tag: any[];
}

export async function getServerSideProps(context: any) {
  let product: any = null;
  const productId = context?.params?.id || '';
  if (productId) {
    const res = await fetch(`${server}/product/${productId}`);
    const _product = await res.json();
    if (_product) {
      product = _product.results;
    }
  }
  return { props: { product } };
}

const Products = ({ product = null }: { product: any }) => {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();
  const { websiteMeta } = useSelector((state: any) => state.cms);

  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedCityName, setSelectedCityName] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [_standardPrice, setStandardPrice] = useState<number>(0);
  const [_doublePrice, setDoublePrice] = useState<number>(0);
  const [_slots, setSlots] = useState<any[]>([]);
  const [_, setExchangeRate] = useState<number>(0);
  const [disabledInput, setDisabledInput] = useState<boolean>(true);

  const [deliveryType, setDeliveryType] = useState("STANDARD");
  const [selectedSlot, setSelectedSlot] = useState<any>();
  const [selectedVariant, setSelectedVariant] = useState<string>("classic");
  const [deliveryDate, setDeliveryDate] = useState<string>("");
  const [productDetailsMeta, setProductDetailsMeta] =
    useState<ProductDetailsMetaType | null>(null);
  const [deliveryPrice, setDeliveryPrice] = useState<number>(0);
  const [vaseAdded, setVaseAdded] = useState(false);
  const [eggLessAdded, setEggLessAdded] = useState(false);
  const [vaseAmount] = useVaseAmount();
  const [egglessAmount] = useEggLessAmount();

  const [showSnackBar, setShowSnackBar] = useState(false);
  const [extraTags, setExtraTags] = useState<any>([]);

  const [snackBarConfig, setSnackBarConfig] = useState<any>({
    variant: "DEFAULT",
    btnText: "Close",
    message: "",
  });
  const [showCalendarModal, setShowCalendarModal] = useState<any>({
    show: false,
  });
  const [customCalendarInputValue, setCustomCalendarInputValue] =
    useState<string>("");
  const [formattedDateObj, setFormattedDateObj] = useState<any>(null);
  const [showPriceHikeMessage, setShowPriceHikeMessage] = useState(false);
  const [priceHikeMessage, setPriceHikeMessage] = useState("");
  const [priceHikeChange, setPriceHikeChange] = useState(0);

  const selectedCat = useProductCategories(
    product?.categories,
    productDetailsMeta?.category ?? []
  );

  const { showRelatedProductModal, workingCart, metaData } = useSelector(
    (state: RootState) => state.cart
  );

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);

        if (product) {
          setStandardPrice(
            +product.countryPrice?.price.standard.currentPrice || 0
          );
          setDoublePrice(
            +product.countryPrice?.price.doubleTheQty.currentPrice || 0
          );

          if (
            product?.extraTags.length &&
            product?.extraTags[0]?.name !== null
          ) {
            setExtraTags(product?.extraTags);
          } else {
            setExtraTags([]);
          }
        }
      } catch (error) {
        setError("Sorry! Product not found. Try again later.");
      } finally {
        setLoading(false);
      }
    }
    async function fetchExchangeRate() {
      try {
        const res = await fetch(`https://open.er-api.com/v6/latest/USD`, {
          method: "GET",
        });
        const exRate = await res.json();
        if (exRate?.rates) {
          const rate = exRate?.rates?.IDR;
          setExchangeRate(rate);
          localStorage.setItem(
            "exchangeRateIDR",
            JSON.stringify({ rate, date: new Date().toLocaleDateString() })
          );
        }
      } catch (error) {
        setError("Sorry! Cannot get exchange rate!");
        localStorage.setItem(
          "exchangeRateIDR",
          JSON.stringify({
            rate: "15544.784898",
            date: new Date().toLocaleDateString(),
          })
        );
      }
    }
    async function fetchProductDetailsMeta() {
      try {
        const res = await fetch(`${server}/product-details-meta`);
        const pdm = await res.json();
        if (pdm?.success) {
          setError("");
          setProductDetailsMeta(pdm.results);
          setCities(
            pdm.results.area.sort((a: any, b: any) =>
              a.name > b.name ? 1 : b.name > a.name ? -1 : 0
            )
          );
          setSlots(pdm.results.deliverySlot);
        }
      } catch (error) {
        setError("Sorry! Cannot get product details meta!");
      }
    }

    if (id) {
      // fetch latest rate after 5 days
      const currentRate = loadState("exchangeRateIDR");
      if (!currentRate?.rate) {
        fetchExchangeRate();
      } else {
        const lastFetchDate: any = new Date(currentRate.date);
        const date2: any = new Date();
        const diffTime = Math.abs(date2 - lastFetchDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        // console.log(diffTime, diffDays);
        if (diffDays > 5) {
          // console.log("fetching current exchange rate now");
          fetchExchangeRate();
        } else {
          // console.log('[exchange] already updated', currentRate);
          setExchangeRate(currentRate?.rate || 15544.784898);
        }
      }
      fetchProduct();
      fetchProductDetailsMeta();
    }
  }, [id]);

  const fetchPrice = (e: any) => {
    // console.log('fetching price for city',e);
    const selectedCity = e;

    if (selectedCity) {
      setDisabledInput(false);
    } else {
      setDisabledInput(true);
    }
    const selectedCityNameById = cities.filter((c) => c._id === selectedCity);
    // console.log("City Name >>>>", selectedCityNameById[0]?.name);

    setSelectedCity(selectedCity);
    setSelectedCityName(selectedCityNameById[0]?.name);
    if (!product.cityPrice.length) {
      return;
    }
    const cityPrice = product.cityPrice.filter(
      (c: any) => c._id === selectedCity
    );

    if (cityPrice.length) {
      setStandardPrice(+(cityPrice[0].price?.standard?.currentPrice || 0));
      setDoublePrice(+(cityPrice[0].price?.doubleTheQty?.currentPrice || 0));
      setDeliveryPrice(+(cityPrice[0].price?.standard?.deliveryPrice || 0));
    } else {
      setStandardPrice(product.countryPrice.price.standard.currentPrice);
      setDoublePrice(product.countryPrice.price.doubleTheQty.currentPrice);
      setDeliveryPrice(100000);
    }
  };

  const updateDeliverySlot = (slot: any) => {
    setSelectedSlot(slot);
    setDeliveryType(slot?.type);

    // check if 'free shipping' is selected from admin
    if (product.extraTags?.length) {
      const isFree = product.extraTags.filter(
        (et: any) => et.name === "Free Shipping"
      );
      if (isFree.length) {
        setDeliveryPrice(0);
        return;
      }
    }

    // update delivery price as per slot
    if (metaData?.areas?.length) {
      const cityData = metaData?.areas.filter((a) => a._id === selectedCity);
      if (cityData.length) {
        // if midnight delivery selected
        if (slot.type === "MIDNIGHT") {
          const deliveryPrice =
            cityData[0].delivery?.midNightDeliveryCharge || 0;
          setDeliveryPrice(+deliveryPrice);
        } else {
          const { deliveryPrice } = cityData[0].delivery;
          if (deliveryPrice?.length) {
            const selectedDeliverySlot = deliveryPrice.filter(
              (dp: any) =>
                dp.dtype === slot?.type &&
                dp.from === slot?.from &&
                dp.to === slot?.to
            );
            if (selectedDeliverySlot?.length) {
              console.log("delivery price >>", selectedDeliverySlot[0]?.price);
              setDeliveryPrice(+(selectedDeliverySlot[0]?.price || 0));
            }
          }
        }
      }
    }
  };

  const onUpgradeOptionChange = (addVase: boolean, eggLess: boolean) => {
    setVaseAdded(addVase);
    setEggLessAdded(eggLess);
  };

  const onClickSnackBarAction = () => {
    setShowSnackBar(!showSnackBar);
  };

  const addProductToCart = (addOns: any = null) => {
    if (!selectedCity) {
      setError("Please select a city");
      return;
    }

    let generatedPrice = workingCart.price;
    let priceUpdatedPercent = 0;
    if (showPriceHikeMessage && priceHikeChange > 0) {
      generatedPrice += (generatedPrice * priceHikeChange) / 100;
      priceUpdatedPercent = priceHikeChange;
    }
    const _product: ProductStoreType = {
      id: product._id,
      code: product?.code,
      eggLess: eggLessAdded,
      eggLessPrice: egglessAmount,
      delivery: {
        type: deliveryType,
        date: deliveryDate,
        price: deliveryPrice,
        time: selectedSlot,
      },
      glassVaseAdded: vaseAdded,
      glassVasePrice: vaseAmount,
      name: product.name,
      qty: 1,
      thumb: product.image.default,
      variant: selectedVariant,
      variantPrice: generatedPrice,
      giftOption: {
        message: "",
        messageType: "",
        occaision: "",
        senderName: "",
        errors: {
          message: false,
          messageType: false,
          occaision: false,
          senderName: false,
        },
      },
      addOns: !addOns?.length ? workingCart.addOns : addOns,
      addOnQty: workingCart.addOnQty,
      addOnPrice: workingCart.addOnPrice,
      countryName: websiteMeta?.payload.basic.assignedCountry,
      cityId: selectedCity,
      cityName: selectedCityName,
      priceUpdatedPercent,
    };
    const [validationError, errorMessage] = validateAddToCartObject(_product);
    if (validationError) {
      setError(errorMessage);
    } else {
      setError("");
      dispatch(updateCartCity(selectedCity));
      dispatch(addProduct({ product: _product, qty: 1 }));
      dispatch(updateWorkingCartAddons());
      setSnackBarConfig({
        ...snackBarConfig,
        message: "Product added to cart!",
        variant: "SUCCESS",
      });

      setTimeout(() => {
        router.push("/cart/summary");
      }, 500);
      setShowSnackBar(!showSnackBar);
    }
  };

  const openCalendarModal = () => {
    setShowCalendarModal({ show: !showCalendarModal.show });
  };
  const onCloseCalendarModal = () => {
    setShowCalendarModal({ show: !showCalendarModal.show });
  };

  const handleModalData = (data: any) => {
    setDeliveryDate(data?.date);
    updateDeliverySlot(data?.slotTime);

    const dateObject = new Date(data?.date);
    const day = dateObject.getDate();
    const month = dateObject.toLocaleString("default", { month: "short" });
    const year = dateObject.getFullYear();
    const dayOfWeek = dateObject.toLocaleString("default", {
      weekday: "short",
    });
    // console.log(day, month, year, dayOfWeek);

    const formattedInputValue = `${day} ${month} ${year} ${dayOfWeek}, ${data?.slotTime?.from} Hrs - ${data?.slotTime?.to} Hrs`;
    // console.log(formattedInputValue);

    setCustomCalendarInputValue(formattedInputValue);
    const dateObj = {
      day: day,
      month: month,
      year: year,
      dayOfWeek: dayOfWeek,
      from: data?.slotTime?.from,
      to: data?.slotTime?.to,
    };
    setFormattedDateObj(dateObj);

    // show hike date message
    if (metaData?.hikeDates?.length) {
      console.log("selected date >>", data.date);
      console.log("hiked dates >>", metaData.hikeDates);
      const isHikedDate: PriceHikeDateType[] = metaData.hikeDates.filter(
        (hk) => {
          const cdate = new Date(hk.date).toLocaleDateString();
          const cyear = +cdate.split("/")[2];
          const cday = +cdate.split("/")[1];
          const cmonth = new Date(hk.date).toLocaleDateString("default", {
            month: "short",
          });

          return year === cyear && month === cmonth && day === cday;
        }
      );
      if (isHikedDate.length) {
        console.log("is tags ??", isHikedDate[0].tags);
        console.log("product tags ??", product.tags);
        if (isHikedDate[0].tags?.length) {
          const allMatchedTags = [];
          for (const tg of isHikedDate[0].tags) {
            if (product?.tags.map((pt: any) => pt._id).includes(tg)) {
              allMatchedTags.push(tg);
            }
          }
          console.log("allMatchedTags ==", allMatchedTags);
          if (isHikedDate[0].tags?.length === allMatchedTags.length) {
            setShowPriceHikeMessage(true);
            setPriceHikeMessage(isHikedDate[0].message);
            setPriceHikeChange(isHikedDate[0].updatedPrice);
          }
        } else {
          // the hike date doesn't have any tags selected
          // in this case we'll hike the price for all the products
          setShowPriceHikeMessage(true);
          setPriceHikeMessage(isHikedDate[0].message);
          setPriceHikeChange(isHikedDate[0].updatedPrice);
        }
      } else {
        setShowPriceHikeMessage(false);
        setPriceHikeMessage("");
        setPriceHikeChange(0);
      }
    }
  };

  return (
    <Layout>
      {product && <Breadcrumb pName={product?.name} />}
      {error && (
        <div className="flex w-full items-center text-red-950 bg-red-300 border-red-950 px-4 py-3 gap-2 mb-4">
          <strong>Error!</strong>
          {error}
        </div>
      )}
      {loading && <Loader showLabel={true} width="w-full" height="h-32" />}
      {product && (
        <div className="container mx-auto px-4 md:px-8 py-8 md:py-12 bg-white">
          <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
            {/* Left: Huge Product Image */}
            <div className="w-full md:w-1/2 flex flex-col gap-4">
              <div className="relative w-full aspect-square md:aspect-[4/5] bg-beige rounded-xl overflow-hidden shadow-sm group">
                <img
                  src={product.image.default}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-105"
                  loading="lazy"
                />
                {extraTags.length > 0 && (
                  <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                    <span className="bg-primary text-white text-xs font-sans tracking-widest uppercase px-4 py-2 shadow-md">
                      {extraTags.map((item: any) => item?.name)?.join(", ")}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Product Details & Actions */}
            <div className="w-full md:w-1/2 flex flex-col">
              <div className="mb-6">
                <SmallReview
                  name={product.name}
                  rating={product.review?.rating}
                  reviewCount={product.review?.count}
                />
                <h1 className="text-3xl md:text-5xl font-serif text-charcoal leading-tight mb-4 mt-2">
                  {product.name}
                </h1>
                <div className="h-0.5 w-16 bg-primary mb-6"></div>
              </div>

              {selectedCat.includes("Plants") && (
                <PlantVariants
                  _product={product}
                  city={selectedCity}
                  updateVariantEvent={(_v: string) => setSelectedVariant(_v)}
                />
              )}

              {selectedCat.includes("Cake") && (
                <CakeVariants
                  _product={product}
                  city={selectedCity}
                  updateVariantEvent={(_v: string) => setSelectedVariant(_v)}
                />
              )}

              {selectedCat.includes("Flowers") && (
                <PlantVariants
                  _product={product}
                  city={selectedCity}
                  updateVariantEvent={(_v: string) => setSelectedVariant(_v)}
                />
              )}

              {(selectedCat.includes("Chocolates") || selectedCat.includes("Stuff Toys")) &&
                !selectedCat.includes("Flowers") && (
                  <PlantVariants
                    _product={product}
                    city={selectedCity}
                    updateVariantEvent={(_v: string) => setSelectedVariant(_v)}
                  />
                )}

              <div className="mt-8 space-y-8 border-t border-blush pt-8">
                <InternationalDeliverySection />
                
                {selectedCat.length > 0 && (
                  <UpgradeOption
                    categories={selectedCat}
                    onUpdate={onUpgradeOptionChange}
                    _product={product}
                  />
                )}
                
                <div className="bg-beige/50 p-6 rounded-xl border border-blush">
                  <h4 className="font-serif text-xl mb-4 text-charcoal">Delivery Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center bg-white border border-blush rounded-md px-4 py-3 shadow-sm hover:border-primary transition-colors">
                      <FaMapMarkerAlt className="text-primary mr-3" size={20} />
                      <div className="flex-1 w-full">
                        <SelectSearch
                          className="w-full text-sm font-sans outline-none bg-transparent"
                          list={cities || []}
                          onChange={(opt: any) => fetchPrice(opt)}
                          value={selectedCity}
                          placeholder="Select Delivery City"
                          disabled={false}
                          countryFlag={false}
                        />
                      </div>
                    </div>
                    
                    <div
                      className={`flex items-center bg-white border border-blush rounded-md px-4 py-3 shadow-sm transition-colors cursor-pointer ${
                        disabledInput ? "opacity-50 cursor-not-allowed" : "hover:border-primary"
                      }`}
                      onClick={() => !disabledInput && openCalendarModal()}
                    >
                      {!customCalendarInputValue && (
                        <FaCalendarAlt className="text-primary mr-3" size={20} />
                      )}
                      
                      {!customCalendarInputValue ? (
                        <span className="text-gray-400 text-sm font-sans w-full truncate">Choose Date & Time</span>
                      ) : (
                        <div className="flex-1 w-full flex flex-col font-sans">
                          <span className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wide">Selected Slot</span>
                          <span className="text-sm text-charcoal font-medium truncate">
                            {formattedDateObj?.day} {formattedDateObj?.month} {formattedDateObj?.year}, {formattedDateObj?.from} - {formattedDateObj?.to} Hrs
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {showPriceHikeMessage && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
                    <FiTruck size={20} className="mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-sm font-sans m-0">
                      {priceHikeMessage || "Due to heavy rush, additional delivery price might get applied!"}
                    </p>
                  </div>
                )}
                
                <div className="mt-8">
                  <AddToCartButton
                    addProductToCart={addProductToCart}
                    disabled={!customCalendarInputValue}
                  />
                  
                  {/* Trust Badges */}
                  <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-blush opacity-70">
                    <div className="flex flex-col items-center">
                      <img src="https://www.probunga.com/assets/template/templateprobunga/image/secure-payment.png" alt="Secure Payment" className="h-8 object-contain mb-2" />
                      <span className="text-[10px] uppercase font-sans tracking-wider">100% Secure</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <img src="https://www.probunga.com/assets/template/templateprobunga/image/freshness-guarantee.png" alt="Freshness Guarantee" className="h-8 object-contain mb-2" />
                      <span className="text-[10px] uppercase font-sans tracking-wider">Freshness Guaranteed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-20 border-t border-blush pt-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
              <div>
                <h3 className="text-2xl font-serif text-charcoal mb-6 border-b border-blush pb-3 inline-block">Product Description</h3>
                <p className="text-sm text-gray-500 font-mono mb-4">Product Code: #{product.code}</p>
                <div className="prose prose-sm text-charcoal font-sans font-light leading-relaxed mb-8">
                  <p>{product.description}</p>
                </div>
                <FlowerCareGuide />
              </div>
              <div>
                <h3 className="text-2xl font-serif text-charcoal mb-6 border-b border-blush pb-3 inline-block">Delivery Information</h3>
                <DeliverInfoTop />
                <div className="mt-6">
                  <DeliveryInformation />
                </div>
              </div>
            </div>
          </div>
          
          {showRelatedProductModal && (
            <AddonModal product={product} addProductToCart={addProductToCart} />
          )}
          
          <div className="mt-20">
            <h3 className="text-3xl font-serif text-charcoal mb-10 text-center">Customer Reviews</h3>
            <HomeReviews />
          </div>
        </div>
      )}
      {showSnackBar && (
        <SnackBar
          message={snackBarConfig.message}
          variant={snackBarConfig.variant}
          action={onClickSnackBarAction}
        />
      )}
      {showCalendarModal.show && (
        <CalendarPopupModal
          openModal={showCalendarModal}
          onClose={onCloseCalendarModal}
          onSaveModalData={handleModalData}
          selectedCity={selectedCity}
        />
      )}
    </Layout>
  );
};

export default Products;
