import { useState, useEffect } from "react";
import { sumOf } from "@/utils/bn";
import DateLib from "@/lib/date/DateLib";
import { getNetworkId } from "@/src/config/environment";
import { useSubgraphFetch } from "@/src/hooks/useSubgraphFetch";
import { getTotalCoverage } from "@/utils/formula";
import { getDiversifiedTotalCoverage } from "@/src/services/covers-products";
import { safeFormatBytes32String } from "@/utils/formatter/bytes32String";

const defaultData = {
  availableCovers: 0,
  reportingCovers: 0,
  tvlCover: '0',
  tvlPool: '0',
  covered: '0',
  coverFee: '0'
}

const getQuery = () => {
  const startOfMonth = DateLib.toUnix(DateLib.getSomInUTC(Date.now()))

  return `
  {
    covers (where: {
      supportsProducts: false
    }) {
      id
    }
    products {
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
  `
}

/**
 *
 * @param {string} coverKey
 * @param {number} liquidityTokenDecimals
 * @returns
 */
export const useFetchHeroStats = (coverKey, liquidityTokenDecimals) => {
  const [data, setData] = useState(defaultData);
  const [loading, setLoading] = useState(false);
  const fetchFetchHeroStats = useSubgraphFetch("useFetchHeroStats");

  useEffect(() => {
    setLoading(true)

    const networkId = getNetworkId();

    if (coverKey) {
      getDiversifiedTotalCoverage(
        networkId,
        safeFormatBytes32String(coverKey),
        liquidityTokenDecimals
      )
        .then(
          ({
            totalCoverage,
            totalCoverFee,
            totalCoveredAmount,
            availableCovers,
            reportingCovers,
          }) => {
            setData({
              availableCovers,
              reportingCovers,
              coverFee: totalCoverFee.toString(),
              covered: totalCoveredAmount.toString(),
              tvlCover: totalCoverage.toString(),
              tvlPool: "0",
            });
          }
        )
        .catch((e) => console.error(e))
        .finally(() => setLoading(false));
      return;
    }

    fetchFetchHeroStats(networkId, getQuery())
      .then((data) => {
        const totalCoverFee = sumOf(
          ...data.protocols.map((x) => x.totalCoverFee)
        )
        const totalCoveredAmount = sumOf(
          ...data.cxTokens.map((x) => x.totalCoveredAmount)
        )

        const tvlCover = getTotalCoverage(data.protocols);

        const productsCount = data.products.length
        const dedicatedPoolCount = data.covers.length

        setData({
          availableCovers: productsCount + dedicatedPoolCount,
          reportingCovers: data.reporting.length,
          coverFee: totalCoverFee.toString(),
          covered: totalCoveredAmount.toString(),
          tvlCover: tvlCover,
          tvlPool: '0'
        })
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [coverKey, fetchFetchHeroStats, liquidityTokenDecimals]);

  return {
    data,
    loading
  }
}
