import {
  useEffect,
  useState
} from 'react'

import { getProviderOrSigner } from '@/lib/connect-wallet/utils/web3'
import DateLib from '@/lib/date/DateLib'
import { DEBOUNCE_TIMEOUT } from '@/src/config/constants'
import { useNetwork } from '@/src/context/Network'
import { useDebounce } from '@/src/hooks/useDebounce'
import { useErrorNotifier } from '@/src/hooks/useErrorNotifier'
import {
  convertToUnits,
  isValidNumber
} from '@/utils/bn'
import { Contract } from '@ethersproject/contracts'
import { t } from '@lingui/macro'
import {
  config,
  registry,
  utils
} from '@neptunemutual/sdk'
import { useWeb3React } from '@web3-react/core'
import { useLingui } from '@lingui/react'

export const defaultInfo = {
  fee: '0',
  utilizationRatio: '0',
  totalAvailableLiquidity: '0',
  floor: '0',
  ceiling: '0',
  rate: '0',
  expiryDate: '0'
}

export const usePolicyFees = ({
  value,
  coverMonth,
  coverKey,
  productKey,
  liquidityTokenDecimals
}) => {
  const { library, account } = useWeb3React()
  const { networkId } = useNetwork()

  const debouncedValue = useDebounce(value, DEBOUNCE_TIMEOUT)
  const [data, setData] = useState(defaultInfo)
  const [loading, setLoading] = useState(false)
  const { notifyError } = useErrorNotifier()

  const { i18n } = useLingui()

  useEffect(() => {
    let ignore = false

    if (
      !networkId ||
      !account ||
      !coverKey ||
      !coverMonth ||
      !debouncedValue ||
      !isValidNumber(debouncedValue)
    ) {
      return
    }

    const signerOrProvider = getProviderOrSigner(library, account, networkId)

    async function exec () {
      setLoading(true)

      const cleanup = () => {
        setLoading(false)
      }

      const handleError = (err) => {
        notifyError(err, t(i18n)`Could not get fees`)
      }

      try {
        const policyContractAddress = await registry.PolicyContract.getAddress(
          networkId,
          signerOrProvider
        )

        const instance = new Contract(
          policyContractAddress,
          config.abis.IPolicy,
          signerOrProvider
        )

        const productKeyArg = productKey || utils.keyUtil.toBytes32('')

        const getCoverFeeInfoCall = instance.getCoverFeeInfo(
          coverKey,
          productKeyArg,
          parseInt(coverMonth, 10),
          convertToUnits(debouncedValue, liquidityTokenDecimals).toString()
        )
        const getExpiryDateCall = instance.getExpiryDate(
          DateLib.unix(),
          parseInt(coverMonth, 10)
        )

        const [getCoverFeeInfoResult, getExpiryDateResult] =
          await Promise.all([getCoverFeeInfoCall, getExpiryDateCall])

        if (ignore) { return }
        cleanup()
        setData({
          fee: getCoverFeeInfoResult.fee.toString(),
          utilizationRatio: getCoverFeeInfoResult.utilizationRatio.toString(),
          totalAvailableLiquidity:
            getCoverFeeInfoResult.totalAvailableLiquidity.toString(),
          floor: getCoverFeeInfoResult.floor.toString(),
          ceiling: getCoverFeeInfoResult.ceiling.toString(),
          rate: getCoverFeeInfoResult.rate.toString(),
          expiryDate: getExpiryDateResult.toString()
        })
      } catch (err) {
        setData({
          fee: '0',
          utilizationRatio: '0',
          totalAvailableLiquidity: '0',
          floor: '0',
          ceiling: '0',
          rate: '0',
          expiryDate: '0'
        })
        handleError(err)
        cleanup()
      }
    }

    exec()

    return () => {
      ignore = true
    }
  }, [
    account,
    coverKey,
    coverMonth,
    debouncedValue,
    library,
    liquidityTokenDecimals,
    networkId,
    notifyError,
    productKey,
    i18n
  ])

  return {
    loading,
    data
  }
}
