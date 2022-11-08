import sdk, { multicall } from '@neptunemutual/sdk'
import { keccak256 as solidityKeccak256 } from '@ethersproject/solidity'
import { registry } from '../../../store-keys'
import { MULTIPLIER } from '@/src/config/constants'

const { Contract, Provider } = multicall

export const getMetadataKeys = () => {
  return [
    registry.policy('policy'),
    registry.policyAdmin('policyAdmin'),
    registry.governance('governance')
  ]
}

export const getKeys = async (
  provider,
  coverKey,
  productKey,
  account,
  metadata
) => {
  const { policy, policyAdmin, governance } = metadata

  const ethcallProvider = new Provider(provider)
  await ethcallProvider.init()

  const policyContract = new Contract(policy, sdk.config.abis.IPolicy)
  const policyAdminContract = new Contract(policyAdmin, sdk.config.abis.IPolicyAdmin)
  const governanceContract = new Contract(governance, sdk.config.abis.IGovernance)

  const getCoverageLagCall = await policyAdminContract.getCoverageLag(coverKey)
  const getCoverPoolSummaryCall = await policyContract.getCoverPoolSummary(
    coverKey,
    productKey
  )

  const getStatusCall = await governanceContract.getStatus(
    coverKey,
    productKey
  )

  const getFirstReportingStakeCall =
    await governanceContract.getFirstReportingStake(coverKey)

  const [getCoverPoolSummaryResult, status, minReportingStake, coverageLag] =
    await ethcallProvider.all([
      getCoverPoolSummaryCall,
      getStatusCall,
      getFirstReportingStakeCall,
      getCoverageLagCall
    ])

  const totalPoolAmount = getCoverPoolSummaryResult.totalAmountInPool
  const activeCommitment = getCoverPoolSummaryResult.totalCommitment
  const productsCount = getCoverPoolSummaryResult.productCount
  const leverage = getCoverPoolSummaryResult.leverage
  const capitalEfficiency = getCoverPoolSummaryResult.productCapitalEfficiency

  let availableLiquidity = totalPoolAmount.sub(activeCommitment)

  // @todo: Fetch these from smart contract
  if (productsCount.toString() !== '0') {
    availableLiquidity = totalPoolAmount
      .mul(leverage)
      .mul(capitalEfficiency)
      .div(productsCount.mul(MULTIPLIER))
      .sub(activeCommitment)
  }

  return [
    {
      returns: 'uint256',
      property: 'totalPoolAmount',
      compute: async () => totalPoolAmount
    },
    {
      returns: 'uint256',
      property: 'activeCommitment',
      compute: async () => activeCommitment
    },
    {
      returns: 'uint256',
      property: 'availableLiquidity',
      compute: async () => availableLiquidity
    },
    {
      returns: 'uint256',
      property: 'coverageLag',
      compute: async () => coverageLag
    },
    {
      key: [sdk.utils.keyUtil.PROTOCOL.NS.GOVERNANCE_REPORTER_COMMISSION],
      returns: 'uint256',
      property: 'reporterCommission'
    },
    {
      key: [sdk.utils.keyUtil.PROTOCOL.NS.COVER_PLATFORM_FEE],
      returns: 'uint256',
      property: 'claimPlatformFee'
    },
    {
      key: [
        sdk.utils.keyUtil.PROTOCOL.NS.GOVERNANCE_REPORTING_PERIOD,
        coverKey
      ],
      returns: 'uint256',
      property: 'reportingPeriod'
    },
    {
      returns: 'uint256',
      property: 'productStatus',
      compute: async () => status
    },
    {
      returns: 'uint256',
      property: 'minReportingStake',
      compute: async () => minReportingStake
    },
    {
      key: [
        sdk.utils.keyUtil.PROTOCOL.NS.GOVERNANCE_REPORTING_INCIDENT_DATE,
        coverKey,
        productKey
      ],
      returns: 'uint256',
      property: 'activeIncidentDate'
    },
    {
      key: [sdk.utils.keyUtil.PROTOCOL.NS.COVER_REQUIRES_WHITELIST, coverKey],
      returns: 'bool',
      property: 'requiresWhitelist'
    },
    {
      property: 'isUserWhitelisted',
      returns: 'bool',
      fn: 'getAddressBoolean',
      args: [
        solidityKeccak256(
          ['bytes32', 'bytes32', 'bytes32'],
          [
            sdk.utils.keyUtil.PROTOCOL.NS.COVER_USER_WHITELIST,
            coverKey,
            productKey
          ]
        ),
        account
      ]
    }
  ]
}
