import { useNetwork } from "@/src/context/Network";
import { fetchSubgraph } from "@/src/services/fetchSubgraph";
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

  useEffect(() => {
    let ignore = false;

    setLoading(true);
    fetchSubgraph("useFlattenedCoverProducts")(networkId, getQuery())
      .then((data) => {
        if (!data || ignore) return;
        setData(data.coverProducts);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });

    return () => {
      ignore = true;
    };
  }, [networkId]);

  return {
    loading,
    data,
  };
};
