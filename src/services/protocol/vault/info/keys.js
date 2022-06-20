import sdk from "@neptunemutual/sdk";
import { ethers } from "ethers";
import { registry } from "../../../store-keys";
import { Contract, Provider } from "ethers-multicall";

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
  const stablecoinTokenSymbolCall = stablecoinContract.symbol();

  const [
    myPodBalance,
    podTotalSupply,
    vaultStablecoinBalance,
    vaultTokenSymbol,
    stablecoinTokenSymbol,
  ] = await ethcallProvider.all([
    myPodBalanceCall,
    podTotalSupplyCall,
    vaultStablecoinBalanceCall,
    vaultTokenSymbolCall,
    stablecoinTokenSymbolCall,
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
        ethers.utils.solidityKeccak256(
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
          return ethers.utils.parseEther("250");
        }

        return value;
      },
    },
    {
      returns: "uint256",
      property: "myShare",
      compute: async ({ result }) => {
        const { vaultStablecoinBalance, myPodBalance, podTotalSupply } = result;
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
