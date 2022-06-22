import { useState, useEffect } from "react";
import { useNetwork } from "@/src/context/Network";
import { useQuery } from "@/src/hooks/useQuery";

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

export const useFetchCovers = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const { networkId } = useNetwork();
  const { data: graphData, refetch } = useQuery();

  useEffect(() => {
    let ignore = false;

    function exec() {
      if (!graphData || !networkId) return;

      const _covers = graphData.covers || [];

      if (ignore) return;
      setData(_covers);
    }

    exec();

    return () => {
      ignore = true;
    };
  }, [graphData, networkId]);

  useEffect(() => {
    let ignore = false;

    setLoading(true);

    refetch(getQuery())
      .catch(console.error)
      .finally(() => {
        if (ignore) return;
        setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [refetch]);

  return {
    data,
    loading,
  };
};
