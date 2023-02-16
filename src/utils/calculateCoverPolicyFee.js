
import { config, registry, utils, multicall } from '@neptunemutual/sdk'

import { convertToUnits } from '@/utils/bn'
import { getProviderOrSigner } from '@/lib/connect-wallet/utils/web3'
import DateLib from '@/lib/date/DateLib'
import { getNetworkId } from '@/src/config/environment'

export const defaultInfo = {
  fee: '0',
  utilizationRatio: '0',
  totalAvailableLiquidity: '0',
  floor: '0',
  ceiling: '0',
  rate: '0',
  expiryDate: '0'
}

export const calculateCoverPolicyFee = async ({
  value,
  coverMonth,
  coverKey,
  productKey,
  library,
  account,
  liquidityTokenDecimals
}) => {
  const networkId = getNetworkId()
  const signerOrProvider = await getProviderOrSigner(library, account, networkId)

  let returnData = defaultInfo
  let err = null

  try {
    const policyContractAddress = await registry.PolicyContract.getAddress(
      networkId,
      signerOrProvider
    )

    const { Contract, Provider } = await multicall

    const multiCallProvider = new Provider(signerOrProvider && signerOrProvider.provider)

    await multiCallProvider.init() // Only required when `chainId` is not provided in the `Provider` constructor

    const instance = new Contract(
      policyContractAddress,
      config.abis.IPolicy
    )

    const productKeyArg = productKey || utils.keyUtil.toBytes32('')

    const getCoverFeeInfoCall = instance.getCoverFeeInfo(
      coverKey,
      productKeyArg,
      parseInt(coverMonth, 10),
      convertToUnits(value, liquidityTokenDecimals).toString()
    )
    const getExpiryDateCall = instance.getExpiryDate(
      DateLib.unix(),
      parseInt(coverMonth, 10)
    )

    const [getCoverFeeInfoResult, getExpiryDateResult] = await multiCallProvider.all([getCoverFeeInfoCall, getExpiryDateCall])
    const data = {
      fee: getCoverFeeInfoResult.fee.toString(),
      utilizationRatio: getCoverFeeInfoResult.utilizationRatio.toString(),
      totalAvailableLiquidity:
        getCoverFeeInfoResult.totalAvailableLiquidity.toString(),
      floor: getCoverFeeInfoResult.floor.toString(),
      ceiling: getCoverFeeInfoResult.ceiling.toString(),
      rate: getCoverFeeInfoResult.rate.toString(),
      expiryDate: getExpiryDateResult.toString()
    }

    returnData = data
  } catch (error) {
    err = error
  }

  return {
    data: returnData,
    error: err
  }
}
