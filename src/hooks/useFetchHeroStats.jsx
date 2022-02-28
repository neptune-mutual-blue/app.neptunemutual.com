import { useState, useEffect } from "react";
import { getGraphURL } from "@/src/config/environment";
import { useAppContext } from "@/src/context/AppWrapper";
import { sumOf } from "@/utils/bn";
import DateLib from "@/lib/date/DateLib";

const defaultData = {
  availableCovers: 0,
  reportingCovers: 0,
  tvlCover: "0",
  tvlPool: "0",
  covered: "0",
  coverFee: "0",
};

export const useFetchHeroStats = () => {
  const [data, setData] = useState(defaultData);
  const [loading, setLoading] = useState(false);
  const { networkId } = useAppContext();

  useEffect(() => {
    if (!networkId) {
      return;
    }

    const graphURL = getGraphURL(networkId);

    if (!graphURL) {
      return;
    }

    const now = DateLib.unix();

    setLoading(true);
    fetch(graphURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        query: `
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
          coverAmounts: coverAmountExpiryDatas (
            where: {
              expiresOn_gt: "${now}",
            }
          ) {
            totalCoveredAmount
          }
        }
        `,
      }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (!res.errors) {
          const tvlCover = sumOf(
            ...res.data.protocols.map((x) => x.totalCoverLiquidityAdded)
          )
            .minus(
              sumOf(
                ...res.data.protocols.map((x) => x.totalCoverLiquidityRemoved)
              )
            )
            .plus(sumOf(...res.data.protocols.map((x) => x.totalFlashLoanFees)))
            .toString();

          setData({
            availableCovers: res.data.covers.length,
            reportingCovers: res.data.reporting.length,
            coverFee: sumOf(
              ...res.data.protocols.map((x) => x.totalCoverFee)
            ).toString(),
            covered: sumOf(
              ...res.data.coverAmounts.map((x) => x.totalCoveredAmount)
            ).toString(),
            tvlCover: tvlCover,
            tvlPool: "0",
          });
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [networkId]);

  return {
    data,
    loading,
  };
};
