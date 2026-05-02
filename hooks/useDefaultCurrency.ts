import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function useDefaultCurrency() {
  const [currency, setCurrency] = useState<string>('');
  const [secCurrency, setSecCurrency] = useState<string>('');
  const { websiteMeta } = useSelector((state: any) => state.cms);

  useEffect(() => {
    if (websiteMeta) {
      setCurrency(websiteMeta?.payload?.basic?.primaryCurrency);
      setSecCurrency(websiteMeta?.payload?.basic?.secondaryCurrency || '');
    }
  }, [])
  return [currency, secCurrency];
}
