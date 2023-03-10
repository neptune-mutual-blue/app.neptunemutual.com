import { useCallback, useEffect, useState } from 'react'
import { useNetwork } from '@/src/context/Network'
import { getReplacedString } from '@/utils/string'
import {
  ADDRESS_ONE,
  CoverStatus,
  COVER_STATS_URL
} from '@/src/config/constants'

export const defaultStats = {
  activeIncidentDate: '0',
  claimPlatformFee: '0',
  activeCommitment: '0',
  isUserWhitelisted: false,
  reporterCommission: '0',
  reportingPeriod: '0',
  requiresWhitelist: false,
  productStatus: '',
  totalPoolAmount: '0',
  availableLiquidity: '0',
  coverageLag: '0',
  policyRateCeiling: '0',
  policyRateFloor: '0',
  minReportingStake: '0'
}

export const useFetchCoverStats = ({ coverKey, productKey }) => {
  const [info, setInfo] = useState(defaultStats)
  const [isLoading, setIsLoading] = useState(false)

  const { networkId } = useNetwork()

  const fetcher = useCallback(async () => {
    if (!networkId || !coverKey || !productKey) return

    let data = null

    {
      // Get data from API if wallet's not connected
      const response = await fetch(
        getReplacedString(COVER_STATS_URL, {
          networkId,
          coverKey,
          productKey,
          account: ADDRESS_ONE
        }),
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          }
        }
      )

      if (!response.ok) {
        return
      }

      data = (await response.json()).data
    }

    if (!data || Object.keys(data).length === 0) {
      return
    }

    return data
  }, [coverKey, networkId, productKey])

  useEffect(() => {
    let ignore = false

    async function exec () {
      setIsLoading(true)
      try {
        const data = await fetcher()

        if (ignore || !data) return

        setInfo({
          activeIncidentDate: data.activeIncidentDate || defaultStats.activeIncidentDate,
          claimPlatformFee: data.claimPlatformFee || defaultStats.claimPlatformFee,
          activeCommitment: data.activeCommitment || defaultStats.activeCommitment,
          isUserWhitelisted: data.isUserWhitelisted || defaultStats.isUserWhitelisted,
          reporterCommission: data.reporterCommission || defaultStats.reporterCommission,
          reportingPeriod: data.reportingPeriod || defaultStats.reportingPeriod,
          requiresWhitelist: data.requiresWhitelist || defaultStats.requiresWhitelist,
          productStatus: CoverStatus[data.productStatus] || CoverStatus[defaultStats.productStatus],
          totalPoolAmount: data.tvl || defaultStats.totalPoolAmount,
          availableLiquidity: data.availableForUnderwriting || defaultStats.availableLiquidity,
          coverageLag: data.coverageLag || defaultStats.coverageLag,
          policyRateCeiling: data.policyRateCeiling || defaultStats.policyRateCeiling,
          policyRateFloor: data.policyRateFloor || defaultStats.policyRateFloor,
          minReportingStake: data.minReportingStake || defaultStats.minReportingStake
        })
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    exec()

    return () => {
      ignore = true
    }
  }, [fetcher])

  const refetch = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await fetcher()

      if (!data) return

      setInfo({
        activeIncidentDate: data.activeIncidentDate || defaultStats.activeIncidentDate,
        claimPlatformFee: data.claimPlatformFee || defaultStats.claimPlatformFee,
        activeCommitment: data.activeCommitment || defaultStats.activeCommitment,
        isUserWhitelisted: data.isUserWhitelisted || defaultStats.isUserWhitelisted,
        reporterCommission: data.reporterCommission || defaultStats.reporterCommission,
        reportingPeriod: data.reportingPeriod || defaultStats.reportingPeriod,
        requiresWhitelist: data.requiresWhitelist || defaultStats.requiresWhitelist,
        productStatus: CoverStatus[data.productStatus] || CoverStatus[defaultStats.productStatus],
        totalPoolAmount: data.totalPoolAmount || defaultStats.totalPoolAmount,
        availableLiquidity: data.availableLiquidity || defaultStats.availableLiquidity,
        coverageLag: data.coverageLag || defaultStats.coverageLag,
        policyRateCeiling: data.policyRateCeiling || defaultStats.policyRateCeiling,
        policyRateFloor: data.policyRateFloor || defaultStats.policyRateFloor,
        minReportingStake: data.minReportingStake || defaultStats.minReportingStake
      })
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }, [fetcher])

  return { info, refetch, isLoading }
}
