import sdk from "@neptunemutual/sdk";
import { keccak256 as solidityKeccak256 } from "@ethersproject/solidity";
import { BigNumber } from "@ethersproject/bignumber";
import { registry } from "../../../store-keys";
import { multicall } from "@neptunemutual/sdk";

const { Contract, Provider } = multicall;

export const getMetadataKeys = (coverKey) => {
  return [registry.vault(coverKey, "vault"), registry.stablecoin("stablecoin")];
};

export const getKeys = async (provider, coverKey, account, metadata) => {
  const { stablecoin, vault } = metadata;

  const ethcallProvider = new Provider(provider);
  await ethcallProvider.init();

  const vaultContract = new Contract(vault, sdk.config.abis.IERC20Detailed);
  const stablecoinContract = new Contract(
    stablecoin,
    sdk.config.abis.IERC20Detailed
  );

  const vaultStablecoinBalanceCall = stablecoinContract.balanceOf(vault);
  const myPodBalanceCall = vaultContract.balanceOf(account);
  const podTotalSupplyCall = vaultContract.totalSupply();
  const vaultTokenSymbolCall = vaultContract.symbol();
  const vaultTokenDecimalsCall = vaultContract.decimals();
  const myStablecoinBalanceCall = stablecoinContract.balanceOf(account);
  const stablecoinTokenSymbolCall = stablecoinContract.symbol();

  const [
    myPodBalance,
    podTotalSupply,
    vaultStablecoinBalance,
    vaultTokenSymbol,
    vaultTokenDecimals,
    stablecoinTokenSymbol,
    myStablecoinBalance,
  ] = await ethcallProvider.all([
    myPodBalanceCall,
    podTotalSupplyCall,
    vaultStablecoinBalanceCall,
    vaultTokenSymbolCall,
    vaultTokenDecimalsCall,
    stablecoinTokenSymbolCall,
    myStablecoinBalanceCall,
  ]);

  return [
    {
      returns: "address",
      property: "stablecoin",
      compute: async () => stablecoin,
    },
    {
      returns: "address",
      property: "vault",
      compute: async () => vault,
    },
    {
      returns: "uint256",
      property: "podTotalSupply",
      compute: async () => podTotalSupply,
    },
    {
      returns: "uint256",
      property: "myPodBalance",
      compute: async () => myPodBalance,
    },
    {
      returns: "uint256",
      property: "vaultStablecoinBalance",
      compute: async () => vaultStablecoinBalance,
    },
    {
      returns: "uint256",
      property: "vaultTokenSymbol",
      compute: async () => vaultTokenSymbol,
    },
    {
      returns: "uint256",
      property: "vaultTokenDecimals",
      compute: async () => vaultTokenDecimals,
    },
    {
      returns: "uint256",
      property: "myStablecoinBalance",
      compute: async () => myStablecoinBalance,
    },
    {
      returns: "uint256",
      property: "stablecoinTokenSymbol",
      compute: async () => stablecoinTokenSymbol,
    },
    {
      key: [
        sdk.utils.keyUtil.PROTOCOL.NS.LENDING_STRATEGY_WITHDRAWAL_START,
        coverKey,
      ],
      returns: "uint256",
      property: "withdrawalStarts",
    },
    {
      key: [
        sdk.utils.keyUtil.PROTOCOL.NS.LENDING_STRATEGY_WITHDRAWAL_END,
        coverKey,
      ],
      returns: "uint256",
      property: "withdrawalEnds",
    },
    {
      key: [sdk.utils.keyUtil.PROTOCOL.NS.COVER_REASSURANCE, coverKey],
      returns: "uint256",
      property: "totalReassurance",
    },
    {
      key: [
        sdk.utils.keyUtil.PROTOCOL.NS.COVER_LIQUIDITY_STAKE,
        coverKey,
        account,
      ],
      signature: ["bytes32", "bytes32", "address"],
      returns: "uint256",
      property: "myStake",
    },
    {
      key: [sdk.utils.keyUtil.PROTOCOL.NS.ACCRUAL_INVOCATION, coverKey],
      returns: "bool",
      property: "isAccrualComplete",
    },
    {
      returns: "uint256",
      property: "amountLentInStrategies",
      fn: "getUint",
      args: [
        solidityKeccak256(
          ["bytes32", "bytes32", "address"],
          [
            sdk.utils.keyUtil.PROTOCOL.NS.VAULT_STRATEGY_OUT,
            coverKey,
            stablecoin,
          ]
        ),
      ],
    },
    {
      key: [sdk.utils.keyUtil.PROTOCOL.NS.COVER_LIQUIDITY_MIN_STAKE],
      returns: "uint256",
      property: "minStakeToAddLiquidity",
      compute: async ({ value }) => {
        if (value.toString() === "0") {
          return BigNumber.from("10").pow(18).mul("250");
        }

        return value;
      },
    },
    {
      returns: "uint256",
      property: "myShare",
      compute: async ({ result }) => {
        const { vaultStablecoinBalance, myPodBalance, podTotalSupply } = result;

        if (podTotalSupply.toString() === "0") return "0";
        return vaultStablecoinBalance.mul(myPodBalance).div(podTotalSupply);
      },
    },
    {
      returns: "uint256",
      property: "myUnrealizedShare",
      compute: async ({ result }) => {
        const {
          vaultStablecoinBalance,
          amountLentInStrategies,
          myPodBalance,
          podTotalSupply,
        } = result;
        if (podTotalSupply.toString() === "0") return "0";
        return vaultStablecoinBalance
          .add(amountLentInStrategies)
          .mul(myPodBalance)
          .div(podTotalSupply);
      },
    },
    {
      returns: "uint256",
      property: "totalLiquidity",
      compute: async ({ result }) => {
        const { vaultStablecoinBalance, amountLentInStrategies } = result;
        return vaultStablecoinBalance.add(amountLentInStrategies);
      },
    },
  ];
};
