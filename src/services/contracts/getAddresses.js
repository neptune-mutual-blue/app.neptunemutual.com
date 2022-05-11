import { registry } from "@neptunemutual/sdk";

import {
  GET_CONTRACTS_INFO_URL,
  NetworkUrlParam,
} from "@/src/config/constants";
import { getReplacedString } from "@/utils/string";

export const getAddressesFromApi = async (networkId) => {
  try {
    const networkName = NetworkUrlParam[networkId];
    const url = getReplacedString(GET_CONTRACTS_INFO_URL, { networkName });

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    });
    const { data } = await response.json();
    const npmAddr = data.find((item) => item.key === "NPM") || {};
    const daiAddr = data.find((item) => item.key === "Stablecoin") || {};

    return {
      NPMTokenAddress: npmAddr.value,
      liquidityTokenAddress: daiAddr.value,
    };
  } catch (error) {
    console.error(error);
  }

  return {};
};

export const getAddressesFromProvider = async (networkId, signerOrProvider) => {
  try {
    const [NPMTokenAddress, liquidityTokenAddress] = await Promise.all([
      registry.NPMToken.getAddress(networkId, signerOrProvider),
      registry.Stablecoin.getAddress(networkId, signerOrProvider),
    ]);

    return {
      NPMTokenAddress,
      liquidityTokenAddress,
    };
  } catch (error) {
    console.error(error);
  }

  return {};
};
