import { useState, useEffect } from "react";
import { useNetwork } from "@/src/context/Network";
import { useQuery } from "@/src/hooks/useQuery";
import { toUtf8String } from "@ethersproject/strings";
import { useIpfs } from "@/src/context/Ipfs";

const getQuery = (id) => {
  return `
  {
    cover (
      id: "${id}"
    ) {
      id
      coverKey
      tokenName
      tokenSymbol
      ipfsHash
      ipfsBytes
      products {
        id
        coverKey
        productKey
        ipfsHash
        ipfsBytes
      }
    }
  }
`;
};

export const useQueryCover = (id) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const { networkId } = useNetwork();
  const { getIpfsByHash } = useIpfs();
  const { data: graphData, refetch } = useQuery();

  useEffect(() => {
    let ignore = false;

    function exec() {
      if (!graphData || !networkId) return;
      if (ignore) return;

      let coverIpfsData =
        graphData?.cover?.ipfsData ||
        getIpfsByHash(graphData?.cover?.ipfsHash) ||
        {};

      try {
        coverIpfsData = JSON.parse(toUtf8String(graphData?.cover?.ipfsBytes));
      } catch (err) {
        console.log(
          "[info] Could not parse ipfs bytes",
          graphData?.cover?.coverKey
        );
      }

      setData({
        ...graphData?.cover,
        ipfsData: coverIpfsData,
        products: graphData?.cover?.products?.map((item) => {
          let productIpfsData =
            item?.ipfsData || getIpfsByHash(item?.ipfsHash) || {};

          try {
            productIpfsData = JSON.parse(toUtf8String(item?.ipfsBytes));
          } catch (err) {
            console.log("[info] Could not parse ipfs bytes", item?.productKey);
          }

          return {
            ...item,
            ipfsData: productIpfsData,
          };
        }),
      });
    }

    exec();

    return () => {
      ignore = true;
    };
  }, [getIpfsByHash, graphData, networkId]);

  useEffect(() => {
    let ignore = false;

    setLoading(true);

    refetch(getQuery(id))
      .catch(console.error)
      .finally(() => {
        if (ignore) return;
        setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [id, refetch]);

  return {
    data,
    loading,
  };
};
