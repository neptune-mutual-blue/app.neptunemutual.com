import { useCoversAndProducts } from "@/src/context/CoversAndProductsData";
import { useNetwork } from "@/src/context/Network";
import { useEffect, useState } from "react";

export function useCoversData({ coverList }) {
  const [coverInfo, setCoverInfo] = useState([]);
  const { networkId } = useNetwork();
  const { getCoverOrProductData } = useCoversAndProducts();

  useEffect(() => {
    if (!networkId) {
      return;
    }

    if (coverInfo.length > 0) return;
    coverList.map((cover) => {
      getCoverOrProductData({
        coverKey: cover.coverKey,
        productKey: cover.productKey,
        networkId,
      })
        .then((data) => {
          setCoverInfo((prev) => [...prev, data]);
        })
        .catch(console.error);
    });
  }, [getCoverOrProductData, networkId, coverList]);

  return coverInfo;
}
