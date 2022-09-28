import { utils } from '@neptunemutual/sdk'

export const CoverStatus = {
  Normal: 0,
  Stopped: 1,
  IncidentHappened: 2,
  FalseReporting: 3,
  Claimable: 4
}

export const totalStakeIncidentOccurred = (
  coverKey,
  productKey,
  incidentDate,
  property = 'yes'
) => {
  return {
    key: [
      utils.keyUtil.PROTOCOL.NS.GOVERNANCE_REPORTING_WITNESS_YES,
      coverKey,
      productKey,
      incidentDate
    ],
    signature: ['bytes32', 'bytes32', 'bytes32', 'uint256'],
    returns: 'uint256',
    property
  }
}

export const coverProductStatusOf = (
  coverKey,
  productKey,
  incidentDate,
  property = 'coverProductStatus'
) => {
  return {
    key: [
      utils.keyUtil.PROTOCOL.NS.COVER_STATUS,
      coverKey,
      productKey,
      incidentDate
    ],
    signature: ['bytes32', 'bytes32', 'bytes32', 'uint256'],
    returns: 'uint256',
    property
  }
}

export const claimPayoutsOf = (
  coverKey,
  productKey,
  incidentDate,
  property = 'claimPayoutsOf'
) => {
  return {
    key: [
      utils.keyUtil.PROTOCOL.NS.CLAIM_PAYOUTS,
      coverKey,
      productKey,
      incidentDate
    ],
    signature: ['bytes32', 'bytes32', 'bytes32', 'uint256'],
    returns: 'uint256',
    property
  }
}

export const myStakeIncidentOccurred = (
  coverKey,
  productKey,
  incidentDate,
  account,
  property = 'myYes'
) => {
  return {
    key: [
      utils.keyUtil.PROTOCOL.NS.GOVERNANCE_REPORTING_STAKE_OWNED_YES,
      coverKey,
      productKey,
      incidentDate,
      account
    ],
    signature: ['bytes32', 'bytes32', 'bytes32', 'uint256', 'address'],
    returns: 'uint256',
    property
  }
}

export const totalStakeFalseReporting = (
  coverKey,
  productKey,
  incidentDate,
  property = 'no'
) => {
  return {
    key: [
      utils.keyUtil.PROTOCOL.NS.GOVERNANCE_REPORTING_WITNESS_NO,
      coverKey,
      productKey,
      incidentDate
    ],
    signature: ['bytes32', 'bytes32', 'bytes32', 'uint256'],
    returns: 'uint256',
    property
  }
}

export const myStakeFalseReporting = (
  coverKey,
  productKey,
  incidentDate,
  account,
  property = 'myNo'
) => {
  return {
    key: [
      utils.keyUtil.PROTOCOL.NS.GOVERNANCE_REPORTING_STAKE_OWNED_NO,
      coverKey,
      productKey,
      incidentDate,
      account
    ],
    signature: ['bytes32', 'bytes32', 'bytes32', 'uint256', 'address'],
    returns: 'uint256',
    property
  }
}

export const myUnstakenAmount = (
  coverKey,
  productKey,
  incidentDate,
  account,
  property = 'unstaken'
) => {
  return {
    key: [
      utils.keyUtil.PROTOCOL.NS.GOVERNANCE_UNSTAKEN,
      coverKey,
      productKey,
      incidentDate,
      account
    ],
    signature: ['bytes32', 'bytes32', 'bytes32', 'uint256', 'address'],
    returns: 'uint256',
    property
  }
}

export const myRewardsUnstaken = (
  coverKey,
  productKey,
  incidentDate,
  account,
  property = 'rewardsUnstaken'
) => {
  return {
    key: [
      utils.keyUtil.PROTOCOL.NS.GOVERNANCE_UNSTAKE_REWARD,
      coverKey,
      productKey,
      incidentDate,
      account
    ],
    signature: ['bytes32', 'bytes32', 'bytes32', 'uint256', 'address'],
    returns: 'uint256',
    property
  }
}

export const latestIncidentDate = (
  coverKey,
  productKey,
  property = 'latestIncidentDate'
) => {
  return {
    key: [
      utils.keyUtil.PROTOCOL.NS.GOVERNANCE_REPORTING_INCIDENT_DATE,
      coverKey,
      productKey
    ],
    returns: 'uint256',
    property
  }
}

export const stakeForfeitBurnRate = (property = 'burnRate') => {
  return {
    key: [utils.keyUtil.PROTOCOL.NS.GOVERNANCE_REPORTING_BURN_RATE],
    returns: 'uint256',
    property
  }
}

export const stakeForfeitReporterComissionRate = (
  property = 'reporterCommissionRate'
) => {
  return {
    key: [utils.keyUtil.PROTOCOL.NS.GOVERNANCE_REPORTER_COMMISSION],
    returns: 'uint256',
    property
  }
}
