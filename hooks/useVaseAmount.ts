import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function useVaseAmount() {
  const [amount, setAmount] = useState<number>(0);
  const [amountUSD, setAmountUSD] = useState<number>(0);
  const { websiteMeta } = useSelector((state: any) => state.cms);
  const defaultExchangeRate = 15544.784898;

  useEffect(() => {
    if (websiteMeta?.payload?.productOption) {
      setAmount(websiteMeta?.payload?.productOption?.addVaseAmount);
      if (typeof window !== "undefined" && window.localStorage) {
        const ex =
          window.localStorage.getItem("exchangeRateIDR");
        if (ex) {
          const exRate = JSON.parse(ex);
          setAmountUSD(
            +(
              websiteMeta?.payload?.productOption?.addVaseAmount / +exRate.rate
            ).toFixed(2)
          );
        } else {
          setAmountUSD(
            +(
              websiteMeta?.payload?.productOption?.addVaseAmount /
              defaultExchangeRate
            ).toFixed(2)
          );
        }
        
      } else {
        setAmountUSD(
          +(
            websiteMeta?.payload?.productOption?.addVaseAmount /
            defaultExchangeRate
          ).toFixed(2)
        );
      }
    }
  }, []);
  return [amount, amountUSD];
}
