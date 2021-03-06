import sdk, { multicall } from "@neptunemutual/sdk";
import { keccak256 as solidityKeccak256 } from "@ethersproject/solidity";
import { registry } from "../../../store-keys";

const { Contract, Provider } = multicall;

export const getMetadataKeys = () => {
  return [registry.policy("policy"), registry.governance("governance")];
};

export const getKeys = async (
  provider,
  coverKey,
  productKey,
  account,
  metadata
) => {
  const { policy, governance } = metadata;

  const ethcallProvider = new Provider(provider);
  await ethcallProvider.init();

  const policyContract = new Contract(policy, sdk.config.abis.IPolicy);

  const governanceContract = new Contract(
    governance,
    sdk.config.abis.IGovernance
  );

  const getCoverPoolSummaryCall = await policyContract.getCoverPoolSummary(
    coverKey,
    productKey
  );

  const getStatusCall = await governanceContract.getStatus(
    coverKey,
    productKey
  );

  const [getCoverPoolSummaryResult, status] = await ethcallProvider.all([
    getCoverPoolSummaryCall,
    getStatusCall,
  ]);

  const [totalPoolAmount, activeCommitment] = getCoverPoolSummaryResult;

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
      returns: "uint256",
      property: "productStatus",
      compute: async () => status,
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
        solidityKeccak256(
          ["bytes32", "bytes32", "bytes32"],
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
