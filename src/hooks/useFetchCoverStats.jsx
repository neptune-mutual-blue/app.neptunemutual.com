import { useState, useEffect } from "react";
import { useAppContext } from "@/src/context/AppWrapper";
import { sumOf } from "@/utils/bn";
import DateLib from "@/lib/date/DateLib";
import BigNumber from "bignumber.js";
import { getCoverStatus } from "@/src/helpers/cover";
import { useQuery } from "@/src/hooks/useQuery";

const defaultData = {
  liquidity: "0",
  protection: "0",
  utilization: "0",
  status: "",
};

const getQuery = (coverKey, now) => {
  return `
  {
    cover(
    id: "${coverKey}"
  ) {
    id
    key
    stopped
    incidentReports (
      first: 1
      where:{
      finalized: false
    }) {
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
  cxTokens(where: {
    expiryDate_gt: "${now}"
    key: "${coverKey}"
  }){
    key
    totalCoveredAmount
  }
  vaults (
    where: {
      key: "${coverKey}"
    }
  ) {
    totalCoverLiquidityAdded
    totalCoverLiquidityRemoved
    totalFlashLoanFees
  }
}
`;
};

export const useFetchCoverStats = ({ coverKey }) => {
  const [data, setData] = useState(defaultData);
  const [loading, setLoading] = useState(false);

  const { networkId } = useAppContext();
  const { data: graphData, refetch } = useQuery();

  useEffect(() => {
    async function exec() {
      if (!graphData || !networkId) return;

      const status = getCoverStatus(
        graphData.cover.incidentReports,
        graphData.cover.stopped
      );

      const liquidity = sumOf(
        ...graphData.vaults.map((x) => x.totalCoverLiquidityAdded)
      )
        .minus(
          sumOf(...graphData.vaults.map((x) => x.totalCoverLiquidityRemoved))
        )
        .plus(sumOf(...graphData.vaults.map((x) => x.totalFlashLoanFees)))
        .toString();

      const protection = sumOf(
        ...graphData.cxTokens.map((x) => x.totalCoveredAmount)
      ).toString();

      setData({
        status,
        liquidity,
        protection,
        utilization: new BigNumber(protection)
          .dividedBy(liquidity)
          .decimalPlaces(2)
          .toString(),
      });
    }

    setLoading(true);
    exec()
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [graphData, networkId]);

  useEffect(() => {
    const now = DateLib.unix();

    if (!coverKey) {
      return;
    }

    refetch(getQuery(coverKey, now));
  }, [coverKey, refetch]);

  return {
    data,
    loading,
  };
};
