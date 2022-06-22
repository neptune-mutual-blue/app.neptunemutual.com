import { useCoversAndProducts } from "@/src/context/CoversAndProductsData";
import { useNetwork } from "@/src/context/Network";
import { useEffect, useState } from "react";

export function useCoverOrProductData({ coverKey, productKey }) {
  const [coverInfo, setCoverInfo] = useState(null);
  const { networkId } = useNetwork();
  const { getCoverOrProductData } = useCoversAndProducts();

  useEffect(() => {
    if (!coverKey || !productKey || !networkId) {
      return;
    }

    getCoverOrProductData({ coverKey, productKey, networkId })
      .then(setCoverInfo)
      .catch(console.error);
  }, [coverKey, getCoverOrProductData, networkId, productKey]);

  return coverInfo;
}
