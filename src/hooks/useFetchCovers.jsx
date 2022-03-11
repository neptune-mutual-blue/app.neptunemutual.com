import { useState, useEffect } from "react";
import { useAppContext } from "@/src/context/AppWrapper";
import { toUtf8String } from "@ethersproject/strings";
import { useQuery } from "@/src/hooks/useQuery";
import { useIpfs } from "@/src/context/Ipfs";
import { calculateCoverStats, defaultStats } from "@/src/helpers/cover";
import DateLib from "@/lib/date/DateLib";

const getQuery = (now) => {
  return `
  {
    covers {
      id
      key
      ipfsHash
      stopped
      vaults {
        totalCoverLiquidityAdded
        totalCoverLiquidityRemoved
        totalFlashLoanFees
      }
      cxTokens(where: { expiryDate_gt: "${now}" }) {
        key
        totalCoveredAmount
      }
      incidentReports(first: 1, where: { finalized: false }) {
        status
        resolved
        incidentDate
        decision
        claimExpiresAt
        claimBeginsFrom
        totalAttestedStake
        totalRefutedStake
      }
    }
  }
`;
};

export const useFetchCovers = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const { networkId } = useAppContext();
  const { data: ipfs, getIpfsByHash } = useIpfs();
  const { data: graphData, refetch } = useQuery();

  useEffect(() => {
    let ignore = false;

    function exec() {
      if (!graphData || !networkId) return;

      const _covers = graphData.covers || [];
      const _data = _covers.map((_cover) => {
        let ipfsData = _cover.ipfsData || ipfs[_cover.ipfsHash];

        try {
          ipfsData = JSON.parse(toUtf8String(_cover.ipfsBytes));
        } catch (err) {
          // console.log("Could not parse ipfs bytes", _cover.key);
        }

        // Fetch IPFS data if does not exist
        if (!ipfsData) {
          getIpfsByHash(_cover.ipfsHash);
          return null;
        }

        return {
          key: _cover.key,
          projectName: ipfsData.projectName,
          coverName: ipfsData.coverName,
          resolutionSources: ipfsData.resolutionSources,
          about: ipfsData.about,
          tags: ipfsData.tags,
          rules: ipfsData.rules,
          links: ipfsData.links,

          ipfsData: ipfsData,
          stats: calculateCoverStats(_cover),
        };
      });

      if (ignore) return;
      setData(_data.filter((x) => !!x));
    }

    exec();

    return () => {
      ignore = true;
    };
  }, [getIpfsByHash, graphData, ipfs, networkId]);

  useEffect(() => {
    let ignore = false;

    setLoading(true);
    const now = DateLib.unix();
    refetch(getQuery(now))
      // .catch(console.error)
      .catch((e) => console.log("cover error", e))
      .finally(() => {
        if (ignore) return;
        setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [refetch]);

  const getInfoByKey = (coverKey) => {
    return data.find((x) => x.key === coverKey) || { stats: defaultStats };
  };

  return {
    data,
    getInfoByKey,
    loading,
  };
};
