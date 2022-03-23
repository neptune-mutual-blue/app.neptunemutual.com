import { useState, useEffect } from "react";
import { sumOf } from "@/utils/bn";
import DateLib from "@/lib/date/DateLib";
import { useQuery } from "@/src/hooks/useQuery";
import { useNetwork } from "@/src/context/Network";

const defaultData = {
  availableCovers: 0,
  reportingCovers: 0,
  tvlCover: "0",
  tvlPool: "0",
  covered: "0",
  coverFee: "0",
};

const getQuery = () => {
  const startOfMonth = DateLib.toUnix(DateLib.getSomInUTC(Date.now()));

  return `
  {
    covers {
      id
    }
    reporting: incidentReports (where: {
      finalized: false
    }) {
      id
    }
    protocols {
      totalFlashLoanFees
      totalCoverLiquidityAdded
      totalCoverLiquidityRemoved
      totalCoverFee
      
      
    }
    cxTokens(where: {
      expiryDate_gt: "${startOfMonth}"
    }){
      totalCoveredAmount
    }
  }
  `;
};

export const useFetchHeroStats = () => {
  const [data, setData] = useState(defaultData);
  const [loading, setLoading] = useState(false);

  const { networkId } = useNetwork();
  const { data: graphData, refetch } = useQuery();

  useEffect(() => {
    async function exec() {
      if (!graphData || !networkId) return;

      const totalCoverLiquidityAdded = sumOf(
        ...graphData.protocols.map((x) => x.totalCoverLiquidityAdded)
      );
      const totalCoverLiquidityRemoved = sumOf(
        ...graphData.protocols.map((x) => x.totalCoverLiquidityRemoved)
      );
      const totalFlashLoanFees = sumOf(
        ...graphData.protocols.map((x) => x.totalFlashLoanFees)
      );
      const totalCoverFee = sumOf(
        ...graphData.protocols.map((x) => x.totalCoverFee)
      );
      const totalCoveredAmount = sumOf(
        ...graphData.cxTokens.map((x) => x.totalCoveredAmount)
      );

      const tvlCover = totalCoverLiquidityAdded
        .minus(totalCoverLiquidityRemoved)
        .plus(totalFlashLoanFees)
        .toString();

      setData({
        availableCovers: graphData.covers.length,
        reportingCovers: graphData.reporting.length,
        coverFee: totalCoverFee.toString(),
        covered: totalCoveredAmount.toString(),
        tvlCover: tvlCover,
      });
    }

    setLoading(true);
    exec()
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [graphData, networkId]);

  useEffect(() => {
    refetch(getQuery());
  }, [refetch]);

  return {
    data,
    loading,
  };
};
