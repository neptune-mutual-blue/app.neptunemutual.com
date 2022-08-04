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

export const useCovers = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { networkId } = useNetwork();

  useEffect(() => {
    let ignore = false;

    setLoading(true);

    fetchSubgraph("useCovers")(networkId, getQuery())
      .then((data) => {
        if (!data || ignore) return;
        setData(data.covers);
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
