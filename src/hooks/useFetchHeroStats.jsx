import { useState, useEffect } from "react";
import { getGraphURL } from "@/src/config/environment";
import { useAppContext } from "@/src/context/AppWrapper";
import { sumOf, toBN } from "@/utils/bn";
import DateLib from "@/lib/date/DateLib";

const defaultData = {
  availableCovers: 0,
  reportingCovers: 0,
  tvlCover: "0",
  tvlPool: "0",
  covered: "0",
  coverFee: "0",
};

// TODO: to be updated
const NPM_PRICE = 1;
const LP_TOKEN_PRICE = 1;
const STAKING_TOKEN_PRICE = 1;
const REWARD_TOKEN_PRICE = 1;

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
            totalLpAddedToBond
            totalNpmClaimedFromBond
          }
          cxTokens(where: {
            expiryDate_gt: "${now}"
          }){
            totalCoveredAmount
          }
          pools {
            poolType
            rewardToken
            stakingToken
            rewardTokenDeposit
            totalRewardsWithdrawn
            totalStakingTokenDeposited
            totalStakingTokenWithdrawn
          }
          bondPools {
            values
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

        const bondInitialNpm = res.data.bondPools.reduce((acc, currentPool) => {
          return sumOf(acc, currentPool.values[3]).toString();
        }, "0");

        const bondNpmClaimed = res.data.protocols.reduce((acc, protocol) => {
          return sumOf(acc, protocol.totalNpmClaimedFromBond).toString();
        }, "0");

        const bondLpTokensAdded = res.data.protocols.reduce((acc, protocol) => {
          return sumOf(acc, protocol.totalLpAddedToBond).toString();
        }, "0");

        const bondNpmBalance = toBN(bondInitialNpm)
          .minus(bondNpmClaimed)
          .toString();

        const tvlBond = sumOf(
          toBN(bondNpmBalance).multipliedBy(NPM_PRICE),
          toBN(bondLpTokensAdded).multipliedBy(LP_TOKEN_PRICE)
        ).toString();

        const tvlStakingPools = res.data.pools.reduce((acc, currentPool) => {
          const rewardAmount = toBN(currentPool.rewardTokenDeposit)
            .minus(currentPool.totalRewardsWithdrawn)
            .toString();

          const stakingTokenAmount = sumOf(
            currentPool.totalStakingTokenDeposited
          )
            .minus(currentPool.totalStakingTokenWithdrawn)
            .toString();

          return sumOf(
            acc,
            toBN(rewardAmount).multipliedBy(REWARD_TOKEN_PRICE),
            toBN(stakingTokenAmount).multipliedBy(STAKING_TOKEN_PRICE)
          ).toString();
        }, "0");

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
            ...res.data.cxTokens.map((x) => x.totalCoveredAmount)
          ).toString(),
          tvlCover: tvlCover,
          tvlPool: sumOf(tvlStakingPools, tvlBond),
        });
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
