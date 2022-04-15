import sdk from "@neptunemutual/sdk";
import { ethers } from "ethers";
import { registry } from "../../../store-keys";

export const getKeys = async (chainId, provider, key, account) => {
  return [
    {
      key: [
        sdk.utils.keyUtil.PROTOCOL.NS.LENDING_STRATEGY_WITHDRAWAL_START,
        key,
      ],
      returns: "uint256",
      property: "withdrawalStarts",
    },
    {
      key: [sdk.utils.keyUtil.PROTOCOL.NS.LENDING_STRATEGY_WITHDRAWAL_END, key],
      returns: "uint256",
      property: "withdrawalEnds",
    },
    {
      key: [sdk.utils.keyUtil.PROTOCOL.NS.COVER_REASSURANCE, key],
      returns: "uint256",
      property: "totalReassurance",
    },
    registry.vault(key, "vault"),
    registry.stablecoin("stablecoin"),
    {
      returns: "uint256",
      property: "podTotalSupply",
      compute: async ({ result }) => {
        const { vault } = result;
        const pod = await sdk.registry.IERC20.getInstance(vault, provider);
        return pod.totalSupply();
      },
    },
    {
      returns: "uint256",
      property: "myPodBalance",
      compute: async ({ result }) => {
        const { vault } = result;
        const pod = await sdk.registry.IERC20.getInstance(vault, provider);
        return pod.balanceOf(account);
      },
    },
    {
      returns: "uint256",
      property: "vaultStablecoinBalance",
      compute: async ({ result }) => {
        const { vault, stablecoin } = result;
        const token = await sdk.registry.IERC20.getInstance(
          stablecoin,
          provider
        );
        return token.balanceOf(vault);
      },
    },
    {
      returns: "uint256",
      property: "amountLentInStrategies",
      compute: async ({ result }) => {
        const { stablecoin } = result;
        const store = sdk.registry.Store.getInstance(chainId, provider);
        const k = ethers.utils.solidityKeccak256(
          ["bytes32", "bytes32", "address"],
          [sdk.utils.keyUtil.PROTOCOL.NS.VAULT_STRATEGY_OUT, key, stablecoin]
        );

        return store.getUint(k);
      },
    },
    // {
    //   returns: "uint256",
    //   property: "liquidityAddedByMe",
    //   compute: async () => {
    //     const store = sdk.registry.Store.getInstance(chainId, provider);
    //     const k = ethers.utils.solidityKeccak256(
    //       ["bytes32", "bytes32", "address"],
    //       [sdk.utils.keyUtil.PROTOCOL.NS.COVER_LIQUIDITY_ADDED, key, account]
    //     );

    //     return store.getUint(k);
    //   },
    // },
    // {
    //   returns: "uint256",
    //   property: "liquidityRemovedByMe",
    //   compute: async () => {
    //     const store = sdk.registry.Store.getInstance(chainId, provider);
    //     const k = ethers.utils.solidityKeccak256(
    //       ["bytes32", "bytes32", "address"],
    //       [sdk.utils.keyUtil.PROTOCOL.NS.COVER_LIQUIDITY_REMOVED, key, account]
    //     );

    //     return store.getUint(k);
    //   },
    // },
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
