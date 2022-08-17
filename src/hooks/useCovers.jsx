import { useState, useEffect } from "react";
import { useNetwork } from "@/src/context/Network";
import { fetchSubgraph } from "@/src/services/fetchSubgraph";

const getQuery = () => {
  return `
  {
    covers {
      id
      coverKey
    }
  }
`;
};

const fetchCovers = fetchSubgraph("useCovers");

export const useCovers = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { networkId } = useNetwork();

  useEffect(() => {
    setLoading(true);

    fetchCovers(networkId, getQuery())
      .then((data) => {
        if (!data) return;
        setData(data.covers);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [networkId]);

  return {
    loading,
    data,
  };
};
