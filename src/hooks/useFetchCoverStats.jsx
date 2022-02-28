import { useState, useEffect } from "react";
import { getGraphURL } from "@/src/config/environment";
import { useAppContext } from "@/src/context/AppWrapper";
import { sumOf } from "@/utils/bn";
import DateLib from "@/lib/date/DateLib";
import BigNumber from "bignumber.js";

const defaultData = {
  liquidity: "0",
  protection: "0",
  utilization: "0",
};

export const useFetchCoverStats = ({ coverKey }) => {
  const [data, setData] = useState(defaultData);
  const [loading, setLoading] = useState(false);
  const { networkId } = useAppContext();

  useEffect(() => {
    if (!networkId || !coverKey) {
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
        `,
      }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.errors) {
          return;
        }

        const liquidity = sumOf(
          ...res.data.vaults.map((x) => x.totalCoverLiquidityAdded)
        )
          .minus(
            sumOf(...res.data.vaults.map((x) => x.totalCoverLiquidityRemoved))
          )
          .plus(sumOf(...res.data.vaults.map((x) => x.totalFlashLoanFees)))
          .toString();

        const protection = sumOf(
          ...res.data.cxTokens.map((x) => x.totalCoveredAmount)
        ).toString();

        setData({
          liquidity,
          protection,
          utilization: new BigNumber(protection)
            .dividedBy(liquidity)
            .decimalPlaces(2)
            .toString(),
        });
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [coverKey, networkId]);

  return {
    data,
    loading,
  };
};
