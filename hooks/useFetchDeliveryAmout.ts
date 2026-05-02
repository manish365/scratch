import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export function useFetchDeliveryAmountByVarient(variant: string = 'classic') {
  const [amount, setAmount] = useState<number>(0);
  const { websiteMeta } = useSelector((state: any) => state.cms);

  useEffect(() => {
    if (websiteMeta?.payload?.productOption) {
      const sdp: any[] = websiteMeta?.payload?.productOption?.SDPOption;
      let _variant = "standard";
      if (variant.toLowerCase() === 'classic') {
        _variant = "standard";
      }
      const selectedOption = sdp.filter((d) => d.option.toLowerCase() === _variant.trim().toLowerCase());
      if (selectedOption.length) {
        setAmount(selectedOption[0].price);
      } else {
        setAmount(sdp[0].price);
      }
    }
  }, []);
  return [amount];
}
