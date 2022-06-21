import { useCallback, useState, useEffect, useMemo } from "react";
import { useNetwork } from "@/src/context/Network";
import { toUtf8String } from "@ethersproject/strings";
import { useQuery } from "@/src/hooks/useQuery";
import { useIpfs } from "@/src/context/Ipfs";

const getQuery = () => {
  return `
  {
    covers {
      id
      coverKey
      tokenName
      tokenSymbol
      ipfsHash
      ipfsBytes
      products {
        id
        coverKey
        ipfsHash
        ipfsBytes
      }
    }
  }
`;
};

export const useQueryCovers = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const { networkId } = useNetwork();
  const { getIpfsByHash, updateIpfsData } = useIpfs();
  const { data: graphData, refetch } = useQuery();

  useEffect(() => {
    let ignore = false;

    function exec() {
      if (!graphData || !networkId) return;

      const _covers = graphData.covers || [];

      if (ignore) return;
      setData(_covers);

      _covers.forEach((_cover) => {
        try {
          JSON.parse(toUtf8String(_cover.ipfsBytes));
        } catch (err) {
          console.log("[covers] Could not parse ipfs bytes", _cover.coverKey);
          updateIpfsData(_cover.ipfsHash); // Fetch data from IPFS
        }
      });
    }

    exec();

    return () => {
      ignore = true;
    };
  }, [graphData, networkId, updateIpfsData]);

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

  const getInfoByKey = useCallback(
    (coverKey) => {
      const _cover = data.find((x) => x.coverKey === coverKey);

      if (!_cover) {
        return null;
      }

      let ipfsData = _cover.ipfsData || getIpfsByHash(_cover.ipfsHash) || {};

      try {
        ipfsData = JSON.parse(toUtf8String(_cover.ipfsBytes));
      } catch (err) {
        console.log("[info] Could not parse ipfs bytes", _cover.coverKey);
      }

      return {
        id: _cover.id || "",
        key: _cover.coverKey || "",
        coverName: ipfsData.coverName || "",
        projectName: ipfsData.projectName || ipfsData.coverName || "",
        tags: ipfsData.tags || [],
        about: ipfsData.about || "",
        rules: ipfsData.rules || "",
        links: ipfsData.links || {},
        leverage: ipfsData.leverage,
        pricingFloor: ipfsData.pricingFloor || "0",
        pricingCeiling: ipfsData.pricingCeiling || "0",
        reportingPeriod: ipfsData.reportingPeriod || 0,
        cooldownPeriod: ipfsData.cooldownPeriod || 0,
        claimPeriod: ipfsData.claimPeriod || 0,
        minReportingStake: ipfsData.minReportingStake || "0",
        resolutionSources: ipfsData.resolutionSources || [],
        stakeWithFees: ipfsData.stakeWithFees || "0",
        reassurance: ipfsData.reassurance || "0",
        products: _cover.products.map((item) => {
          let productIpfsData =
            item.ipfsData || getIpfsByHash(item.ipfsHash) || {};

          try {
            productIpfsData = JSON.parse(toUtf8String(item.ipfsBytes));
          } catch (err) {
            console.log("[info] Could not parse ipfs bytes", item.productKey);
          }
          return productIpfsData;
        }),
      };
    },
    [data, getIpfsByHash]
  );

  // TODO: remove this
  const finalData = useMemo(
    () => data.map((x) => getInfoByKey(x.coverKey)),
    [data, getInfoByKey]
  );

  return {
    data: finalData,
    getInfoByKey,
    loading,
  };
};
