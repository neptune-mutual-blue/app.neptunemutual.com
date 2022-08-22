import { useNetwork } from "@/src/context/Network";
import { useSubgraphFetch } from "@/src/hooks/useSubgraphFetch";
import { useEffect, useState } from "react";

const getQuery = () => {
  return `
  {
    coverProducts {
      id
      coverKey
      productKey
    }
  }
`;
};

export const useFlattenedCoverProducts = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { networkId } = useNetwork();
  const fetchFlattenedCoverProducts = useSubgraphFetch(
    "useFlattenedCoverProducts"
  );

  useEffect(() => {
    setLoading(true);
    fetchFlattenedCoverProducts(networkId, getQuery())
      .then((data) => {
        if (!data) return;
        setData(data.coverProducts);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [fetchFlattenedCoverProducts, networkId]);

  return {
    loading,
    data,
  };
};
