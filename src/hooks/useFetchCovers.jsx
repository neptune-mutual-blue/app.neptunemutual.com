import { useCallback, useState, useEffect, useMemo } from "react";
import { useNetwork } from "@/src/context/Network";
import { toUtf8String } from "@ethersproject/strings";
import { useQuery } from "@/src/hooks/useQuery";
import { useIpfs } from "@/src/context/Ipfs";

const getQuery = () => {
  return `
  {
    covers (
      where: {
        supportsProducts: false
      }
    ) {
      id
      coverKey
      tokenName
      tokenSymbol
      ipfsHash
      ipfsBytes
    }
  }
`;
};

const getBasketQuery = () => {
  return `
  {
    covers (
      where: {
        supportsProducts: true
      }
    ) {
      id
      coverKey
      tokenName
      tokenSymbol
      ipfsHash
      ipfsBytes
      products{
        id
        productKey
        ipfsHash
        ipfsBytes
      }
    }
  }
`;
};

export const useFetchCovers = (type = "standalone") => {
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

    if (type === "standalone") {
      refetch(getQuery())
        .catch(console.error)
        .finally(() => {
          if (ignore) return;
          setLoading(false);
        });
    }
    if (type === "basket") {
      refetch(getBasketQuery())
        .catch(console.error)
        .finally(() => {
          if (ignore) return;
          setLoading(false);
        });
    }

    return () => {
      ignore = true;
    };
  }, [refetch, type]);

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
        key: _cover.coverKey || "",
        coverName: ipfsData.coverName || "",
        projectName: ipfsData.projectName || "",
        tags: ipfsData.tags || [],
        about: ipfsData.about || "",
        rules: ipfsData.rules || "",
        links: ipfsData.links || {},
        pricingFloor: ipfsData.pricingFloor || "0",
        pricingCeiling: ipfsData.pricingCeiling || "0",
        reportingPeriod: ipfsData.reportingPeriod || 0,
        cooldownPeriod: ipfsData.cooldownPeriod || 0,
        claimPeriod: ipfsData.claimPeriod || 0,
        minReportingStake: ipfsData.minReportingStake || "0",
        resolutionSources: ipfsData.resolutionSources || [],
        stakeWithFees: ipfsData.stakeWithFees || "0",
        reassurance: ipfsData.reassurance || "0",
      };
    },
    [data, getIpfsByHash]
  );

  const getBasketInfoByKey = useCallback(
    (coverKey, productKey) => {
      const _cover = data.find((x) => x.coverKey === coverKey);
      const _product = _cover?.["products"].find(
        (p) => p.productKey === productKey
      );

      if (!_cover && !_product) {
        return null;
      }

      let coverIpfsData =
        _cover.ipfsData || getIpfsByHash(_cover.ipfsHash) || {};

      let productIpfsData =
        _product.ipfsData || getIpfsByHash(_product.ipfsHash) || {};

      try {
        coverIpfsData = JSON.parse(toUtf8String(_cover.ipfsBytes));
        productIpfsData = JSON.parse(toUtf8String(_product.ipfsBytes));
      } catch (err) {
        console.log("[info] Could not parse ipfs bytes", _product.productKey);
      }

      return {
        key: _product.productKey || "",
        coverName: productIpfsData.productName || "",
        projectName: productIpfsData.productName || "",
        tags: productIpfsData.tags || [],
        about: productIpfsData.about || "",
        rules: productIpfsData.rules || "",
        links: productIpfsData.links || {},
        pricingFloor: coverIpfsData.pricingFloor || "0",
        pricingCeiling: coverIpfsData.pricingCeiling || "0",
        reportingPeriod: coverIpfsData.reportingPeriod || 0,
        cooldownPeriod: coverIpfsData.cooldownPeriod || 0,
        claimPeriod: coverIpfsData.claimPeriod || 0,
        minReportingStake: coverIpfsData.minReportingStake || "0",
        resolutionSources: productIpfsData.resolutionSources || [],
        stakeWithFees: coverIpfsData.stakeWithFees || "0",
        reassurance: coverIpfsData.reassurance || "0",
      };
    },
    [data, getIpfsByHash]
  );

  // TODO: remove this
  const finalData = useMemo(() => {
    if (type === "standalone") {
      return data.map((x) => getInfoByKey(x.coverKey));
    }
    if (type === "basket") {
      return data.map((x) => {
        x?.products.map((p) => getBasketInfoByKey(x.coverKey, p.productKey));
      });
    }
  }, [type, data, getInfoByKey, getBasketInfoByKey]);

  return {
    data: finalData,
    getInfoByKey,
    getBasketInfoByKey,
    loading,
  };
};
