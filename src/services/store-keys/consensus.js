import { utils } from "@neptunemutual/sdk";

export const CoverStatus = {
  Normal: 0,
  Stopped: 1,
  IncidentHappened: 2,
  FalseReporting: 3,
  Claimable: 4,
};

export const totalStakeIncidentOccurred = (
  coverKey,
  incidentDate,
  property = "yes"
) => {
  return {
    key: [
      utils.keyUtil.PROTOCOL.NS.GOVERNANCE_REPORTING_WITNESS_YES,
      coverKey,
      incidentDate,
    ],
    signature: ["bytes32", "bytes32", "uint256"],
    returns: "uint256",
    property,
  };
};

export const coverStatusOf = (
  coverKey,
  incidentDate,
  property = "coverStatus"
) => {
  return {
    key: [utils.keyUtil.PROTOCOL.NS.COVER_STATUS, coverKey, incidentDate],
    signature: ["bytes32", "bytes32", "uint256"],
    returns: "uint256",
    property,
  };
};

export const myStakeIncidentOccurred = (
  coverKey,
  incidentDate,
  account,
  property = "myYes"
) => {
  return {
    key: [
      utils.keyUtil.PROTOCOL.NS.GOVERNANCE_REPORTING_STAKE_OWNED_YES,
      coverKey,
      incidentDate,
      account,
    ],
    signature: ["bytes32", "bytes32", "uint256", "address"],
    returns: "uint256",
    property,
  };
};

export const totalStakeFalseReporting = (
  coverKey,
  incidentDate,
  property = "no"
) => {
  return {
    key: [
      utils.keyUtil.PROTOCOL.NS.GOVERNANCE_REPORTING_WITNESS_NO,
      coverKey,
      incidentDate,
    ],
    signature: ["bytes32", "bytes32", "uint256"],
    returns: "uint256",
    property,
  };
};

export const myStakeFalseReporting = (
  coverKey,
  incidentDate,
  account,
  property = "myNo"
) => {
  return {
    key: [
      utils.keyUtil.PROTOCOL.NS.GOVERNANCE_REPORTING_STAKE_OWNED_NO,
      coverKey,
      incidentDate,
      account,
    ],
    signature: ["bytes32", "bytes32", "uint256", "address"],
    returns: "uint256",
    property,
  };
};

export const myUnstakenAmount = (
  coverKey,
  incidentDate,
  account,
  property = "unstaken"
) => {
  return {
    key: [
      utils.keyUtil.PROTOCOL.NS.GOVERNANCE_UNSTAKEN,
      coverKey,
      incidentDate,
      account,
    ],
    signature: ["bytes32", "bytes32", "uint256", "address"],
    returns: "uint256",
    property,
  };
};

export const myRewardsUnstaken = (
  coverKey,
  incidentDate,
  account,
  property = "rewardsUnstaken"
) => {
  return {
    key: [
      utils.keyUtil.PROTOCOL.NS.GOVERNANCE_UNSTAKE_REWARD,
      coverKey,
      incidentDate,
      account,
    ],
    signature: ["bytes32", "bytes32", "uint256", "address"],
    returns: "uint256",
    property,
  };
};

export const latestIncidentDate = (
  coverKey,
  property = "latestIncidentDate"
) => {
  return {
    key: [
      utils.keyUtil.PROTOCOL.NS.GOVERNANCE_REPORTING_INCIDENT_DATE,
      coverKey,
    ],
    returns: "uint256",
    property,
  };
};

export const stakeForfeitBurnRate = (property = "burnRate") => {
  return {
    key: [utils.keyUtil.PROTOCOL.NS.GOVERNANCE_REPORTING_BURN_RATE],
    returns: "uint256",
    property,
  };
};

export const stakeForfeitReporterComissionRate = (
  property = "reporterCommissionRate"
) => {
  return {
    key: [utils.keyUtil.PROTOCOL.NS.GOVERNANCE_REPORTER_COMMISSION],
    returns: "uint256",
    property,
  };
};
