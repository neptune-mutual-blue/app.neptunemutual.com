import { useCoversAndProducts } from "@/src/context/CoversAndProductsData";
import { useNetwork } from "@/src/context/Network";
import { useEffect, useState } from "react";

export function useCoverOrProductData({ coverKey, productKey }) {
  const [coverInfo, setCoverInfo] = useState(null);
  const { networkId } = useNetwork();
  const { getCoverOrProductData } = useCoversAndProducts();

  useEffect(() => {
    let ignore = false;
    if (!coverKey || !productKey || !networkId) {
      return;
    }

    getCoverOrProductData({ coverKey, productKey, networkId })
      .then((data) => {
        if (ignore) return;
        setCoverInfo(data);
      })
      .catch(console.error);

    return () => {
      ignore = true;
    };
  }, [coverKey, getCoverOrProductData, networkId, productKey]);

  return coverInfo;
}
