import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function useFetchCustomFlowerPrice() {
  const [config, setConfig] = useState<any>({});
  const { websiteMeta } = useSelector((state: any) => state.cms);

  useEffect(() => {
    if (websiteMeta?.payload.productOption?.customRoses) {
      setConfig(websiteMeta.payload.productOption.customRoses);
    }
  }, [setConfig, websiteMeta]);
  return config;
}
