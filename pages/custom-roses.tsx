import React, { useEffect, useState } from "react";
import Layout from "../layouts/Main";
import Breadcrumb from "@components/breadcrumb";
import { BasketOptions, RoseBox, SetupDelivery, Stepper } from "@components/custom";
import { CustomProductColType } from "~types/General";
import useFetchCustomFlowerPrice from "@hooks/useFetchCustomFlowerPrice";
import useDefaultCurrency from "@hooks/useDefaultCurrency";

interface CustomProductType {
  title: string;
  update: any;
  cols: CustomProductColType[];
}

function CustomRoses() {
  const [error, setError] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [orAmount, setOrAmount] = useState<number>(0);
  const [step, setStep] = useState("step-one");
  const [products, setProducts] = useState<CustomProductType[]>([]);
  const [selectedBasket, setSelectedBasket] = useState("");
  // eslint-disable-next-line
  const [deliveryInfo, setDeliveryInfo] = useState({
    country: "",
    city: "",
    deliveryDate: "",
    deliveryTime: "",
  });

  const customConfig = useFetchCustomFlowerPrice();
  const [currency] = useDefaultCurrency();

  useEffect(() => {
    setProducts([
      {
        title: "Roses",
        update: updateQty,
        cols: [
          {
            img: "https://www.probunga.com/assets/template/templateprobunga/image/c-1.webp",
            imgAlt: "Red Roses",
            title: "Red",
            number: 0,
          },
          {
            img: "https://www.probunga.com/assets/template/templateprobunga/image/c-2.webp",
            imgAlt: "Pink Roses",
            title: "Pink",
            number: 0,
          },
          {
            img: "https://www.probunga.com/assets/template/templateprobunga/image/c-3.webp",
            imgAlt: "White Roses",
            title: "White",
            number: 0,
          },
          {
            img: "https://www.probunga.com/assets/template/templateprobunga/image/c-4.webp",
            imgAlt: "Orange Roses",
            title: "Orange",
            number: 0,
          },
          {
            img: "https://www.probunga.com/assets/template/templateprobunga/image/c-5.webp",
            imgAlt: "Yellow Roses",
            title: "Yellow",
            number: 0,
          },
          {
            img: "https://www.probunga.com/assets/template/templateprobunga/image/c-21.webp",
            imgAlt: "Mix Roses",
            title: "Mix",
            number: 0,
          },
        ],
      },
      {
        title: "Carnations",
        update: updateQty,
        cols: [
          {
            img: "https://www.probunga.com/assets/template/templateprobunga/image/c-6.webp",
            imgAlt: "Red Carnations",
            title: "Red",
            number: 0,
          },
          {
            img: "https://www.probunga.com/assets/template/templateprobunga/image/c-7.webp",
            imgAlt: "Pink Carnations",
            title: "Pink",
            number: 0,
          },
          {
            img: "https://www.probunga.com/assets/template/templateprobunga/image/c-8.webp",
            imgAlt: "Yellow Carnations",
            title: "Yellow",
            number: 0,
          },
          {
            img: "https://www.probunga.com/assets/template/templateprobunga/image/c-9.webp",
            imgAlt: "White Carnations",
            title: "White",
            number: 0,
          },
          {
            img: "https://www.probunga.com/assets/template/templateprobunga/image/d55.webp",
            imgAlt: "Mix Carnations",
            title: "Mix",
            number: 0,
          },
        ],
      },
      {
        title: "Gerberas",
        update: updateQty,
        cols: [
          {
            img: "https://www.probunga.com/assets/template/templateprobunga/image/c-10.webp",
            imgAlt: "Orange Gerberas",
            title: "Orange",
            number: 0,
          },
          {
            img: "https://www.probunga.com/assets/template/templateprobunga/image/c-12.webp",
            imgAlt: "Pink Gerberas",
            title: "Pink",
            number: 0,
          },
          {
            img: "https://www.probunga.com/assets/template/templateprobunga/image/c-13.webp",
            imgAlt: "White Gerberas",
            title: "White",
            number: 0,
          },
          {
            img: "https://www.probunga.com/assets/template/templateprobunga/image/c-14.webp",
            imgAlt: "Yellow Gerberas",
            title: "Yellow",
            number: 0,
          },
          {
            img: "https://www.probunga.com/assets/template/templateprobunga/image/c-15.webp",
            imgAlt: "Red Gerberas",
            title: "Red",
            number: 0,
          },
          {
            img: "https://www.probunga.com/assets/template/templateprobunga/image/c-20.webp",
            imgAlt: "Mix Gerberas",
            title: "Mix",
            number: 0,
          },
        ],
      },
      {
        title: "Lilys",
        update: updateQty,
        cols: [
          {
            img: "https://www.probunga.com/assets/template/templateprobunga/image/c-16.webp",
            imgAlt: "White Lilys",
            title: "White",
            number: 0,
          },
          {
            img: "https://www.probunga.com/assets/template/templateprobunga/image/c-17.webp",
            imgAlt: "Pink Lilys",
            title: "Pink",
            number: 0,
          },
          {
            img: "https://www.probunga.com/assets/template/templateprobunga/image/c-18.webp",
            imgAlt: "Orange Lilys",
            title: "Orange",
            number: 0,
          },
          {
            img: "https://www.probunga.com/assets/template/templateprobunga/image/c-19.webp",
            imgAlt: "Yellow Lilys",
            title: "Yellow",
            number: 0,
          },
          {
            img: "https://www.probunga.com/assets/template/templateprobunga/image/d54.webp",
            imgAlt: "Mix Lilys",
            title: "Mix",
            number: 0,
          },
        ],
      },
    ]);

    return () => {
      setProducts([]);
    };
  }, [setProducts]);

  const updateQty = (title: string, index: number, value: number | string) => {
    setError("");
    if (+value < 0) {
      setError('Invalid Flower quantity entered!')
      return
    }

    if (products.length) {
      const productsCopy = [...products]
      productsCopy.forEach(p => {
        if (p.title.toLowerCase() === title.toLowerCase()) {
          p.cols[index].number = +value
        }
      })
      setProducts(productsCopy);
      setAmount(updateTotalAmount(productsCopy));
    }
  };

  const calculatePrice = () => {
    let totalAmount = 0
    if (step === 'step-one') {
      let hasNoError = false
      products.forEach((p) => {
        const totalQty = p.cols.reduce((sum, c) => {
          return sum + c.number;
        }, 0);
        let customConfigKey = "roses";
        if (p.title.toLowerCase() === "roses") {
          customConfigKey = p.title.toLowerCase();
        } else {
          customConfigKey = p.title.toLowerCase().slice(0, -1);
        }

        if (totalQty < +customConfig[customConfigKey]?.qty) {
          // min quantity does not match
          hasNoError = true;
          setError(
            `Must add minimum ${customConfig[customConfigKey].qty} ${p.title}(s)`
          );
          return;
        }
        // console.log(p.title, totalQty);
        totalAmount += totalQty * +customConfig[customConfigKey].price;
      });
      if (!hasNoError) {
        setAmount(totalAmount);
        setOrAmount(totalAmount);
        setStep("step-two");
      }
    } else if (step === "step-two") {
      setError('')
      if (!selectedBasket) {
        setError('Please choose your basket first!')
        return
      }
      const basketAmount = +customConfig[selectedBasket];
      setAmount(amount + basketAmount);
      setStep("step-three");
    } else if (step === "step-three") {
      // console.log("[customConfig]", customConfig);
      // console.log("[products]", products);
      // console.log("[amount]", amount);
      // console.log("[selectedBasket]", selectedBasket);
      console.log("[deliveryInfo]", deliveryInfo);
    }
  }

  const updateTotalAmount = (products: CustomProductType[]) => {
    let totalAmount = 0;
    products.forEach(p => {
      const totalQty = p.cols.reduce((sum, c) => {
        return sum + c.number;
      }, 0);
      let customConfigKey = "roses";
      if (p.title.toLowerCase() === "roses") {
        customConfigKey = p.title.toLowerCase();
      } else {
        customConfigKey = p.title.toLowerCase().slice(0, -1);
      }
      // console.log(p.title, totalQty);
      totalAmount += totalQty * +customConfig[customConfigKey].price;
    })
    return totalAmount;
  };

  const onUpdateBasket = (title: string) => {
    setSelectedBasket(title);
    const basketAmount = +customConfig[title];
    setAmount(orAmount + basketAmount);
  }

  const onUpdateDeliveryOption = (
    country: string,
    city: string,
    deliveryDate: string,
    deliveryTime: string
  ) => {
    setDeliveryInfo({
      city,
      country,
      deliveryDate,
      deliveryTime,
    });
  };

  return (
    <Layout title="Custom Roses | FlowersChamp">
      <Breadcrumb pName={"Custom Flowers"} />
      <div className="container">
        {error && (
          <span className="flex items-center w-full bg-red-300 text-error mb-4 px-4 py-2 gap-2">
            <strong>Error!</strong>
            {error}
          </span>
        )}
        <div className="row">
          <div className="col-md-4 text-center">
            <Stepper
              title="Step 1"
              subTitle="Choose Your Flowers & Color"
              disabled={step === "step-one" ? false : true}
            />
          </div>
          <div className="col-md-4 text-center">
            <Stepper
              title="Step 2"
              subTitle="Choose Your Design"
              disabled={step === "step-two" ? false : true}
            />
          </div>
          <div className="col-md-4 text-center">
            <Stepper
              title="Step 3"
              subTitle="Set Up Delivery"
              disabled={step === "step-three" ? false : true}
            />
          </div>
        </div>
        <div className="row mt-4 mb-4 border-bottom"></div>
        {step === "step-one" && (
          <div className="row">
            {products.map((p) => (
              <div className="col-md-6 px-4 py-2" key={p.title}>
                <RoseBox
                  title={p.title}
                  key={p.title}
                  cols={p.cols}
                  update={updateQty}
                />
              </div>
            ))}
          </div>
        )}
        {step === "step-two" && (
          <BasketOptions updatedBasket={onUpdateBasket} />
        )}
        {step === "step-three" && (
          <SetupDelivery updateDeliveryOption={onUpdateDeliveryOption} />
        )}
        <div className="row">
          <div className="col-md-12 mt-4 text-right flex justify-end">
            <div className="flex items-center gap-2">
              <span>
                Amount:{" "}
                <strong>
                  {currency} {(+amount)?.toFixed(2)}
                </strong>
              </span>
              <button
                onClick={calculatePrice}
                className="border px-4 py-1 bg-slate-800 text-white text-uppercase"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
        <div className="row mt-4 mb-4 border-bottom"></div>
      </div>
    </Layout>
  );
}

export default CustomRoses;
