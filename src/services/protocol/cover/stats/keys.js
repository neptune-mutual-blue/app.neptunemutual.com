import sdk from "@neptunemutual/sdk";
import { ethers } from "ethers";
import { registry } from "../../../store-keys";

export const getMetadataKeys = () => {
  return [registry.policy("policy")];
};

export const getKeys = async (
  provider,
  coverKey,
  productKey,
  account,
  metadata
) => {
  const { policy } = metadata;

  const policyContract = sdk.utils.contract.getContract(
    policy,
    sdk.config.abis.IPolicy,
    provider
  );
  const [totalPoolAmount, activeCommitment] =
    await policyContract.getCoverPoolSummary(coverKey);

  const availableLiquidity = totalPoolAmount.sub(activeCommitment);

  return [
    {
      returns: "uint256",
      property: "totalPoolAmount",
      compute: async () => totalPoolAmount,
    },
    {
      returns: "uint256",
      property: "activeCommitment",
      compute: async () => activeCommitment,
    },
    {
      returns: "uint256",
      property: "availableLiquidity",
      compute: async () => availableLiquidity,
    },
    {
      key: [sdk.utils.keyUtil.PROTOCOL.NS.GOVERNANCE_REPORTER_COMMISSION],
      returns: "uint256",
      property: "reporterCommission",
    },
    {
      key: [sdk.utils.keyUtil.PROTOCOL.NS.COVER_PLATFORM_FEE],
      returns: "uint256",
      property: "claimPlatformFee",
    },
    {
      key: [
        sdk.utils.keyUtil.PROTOCOL.NS.GOVERNANCE_REPORTING_PERIOD,
        coverKey,
      ],
      returns: "uint256",
      property: "reportingPeriod",
    },
    {
      key: [sdk.utils.keyUtil.PROTOCOL.NS.COVER_STATUS, coverKey],
      returns: "uint256",
      property: "coverStatus",
    },
    {
      key: [sdk.utils.keyUtil.PROTOCOL.NS.COVER_STATUS, coverKey, productKey],
      returns: "uint256",
      property: "productStatus",
    },
    {
      key: [
        sdk.utils.keyUtil.PROTOCOL.NS.GOVERNANCE_REPORTING_INCIDENT_DATE,
        coverKey,
        productKey,
      ],
      returns: "uint256",
      property: "activeIncidentDate",
    },
    {
      key: [sdk.utils.keyUtil.PROTOCOL.NS.COVER_REQUIRES_WHITELIST, coverKey],
      returns: "bool",
      property: "requiresWhitelist",
    },
    {
      property: "isUserWhitelisted",
      returns: "bool",
      fn: "getAddressBoolean",
      args: [
        ethers.utils.solidityKeccak256(
          ["bytes32", "bytes32"],
          [
            sdk.utils.keyUtil.PROTOCOL.NS.COVER_USER_WHITELIST,
            coverKey,
            productKey,
          ]
        ),
        account,
      ],
    },
  ];
};
