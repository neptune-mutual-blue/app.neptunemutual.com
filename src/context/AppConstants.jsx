import React, { useCallback, useEffect, useState } from "react";
import { registry } from "@neptunemutual/sdk";

import { useNetwork } from "@/src/context/Network";
import { usePoolsTVL } from "@/src/hooks/usePoolsTVL";
import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { useWeb3React } from "@web3-react/core";
import {
  GET_CONTRACTS_INFO_URL,
  NetworkUrlParam,
} from "@/src/config/constants";
import { getReplacedString } from "@/utils/string";

const initValue = {
  liquidityTokenAddress: "",
  NPMTokenAddress: "",
  poolsTvl: "0",
  getTVLById: (_id) => "0",
  getPriceByAddress: (_address) => "0",
};

const AppConstantsContext = React.createContext(initValue);

export function useAppConstants() {
  const context = React.useContext(AppConstantsContext);
  if (context === undefined) {
    throw new Error(
      "useAppConstants must be used within a AppConstantsProvider"
    );
  }
  return context;
}

export const AppConstantsProvider = ({ children }) => {
  const [data, setData] = useState(initValue);
  const { networkId } = useNetwork();
  const {
    tvl,
    getTVLById,
    getPriceByAddress,
    loaded: tvlLoaded,
  } = usePoolsTVL(data.NPMTokenAddress);
  const { library, account } = useWeb3React();

  /**
   * Set token value
   * @param {string} _address - token value
   * @param {string} key- token name
   */
  const setAddress = useCallback((_address, key) => {
    setData((prev) => ({
      ...prev,
      [key]: _address,
    }));
  }, []);

  const getAddressFromApi = useCallback(
    async (networkId) => {
      try {
        const networkName = NetworkUrlParam[networkId];
        const response = await fetch(
          getReplacedString(GET_CONTRACTS_INFO_URL, { networkName }),
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
            },
          }
        );
        const { data } = await response.json();
        const npm = data.find((item) => item.key === "NPM");
        const _addr = npm.value;
        setAddress(_addr, "NPMTokenAddress");

        const dai = data.find((item) => item.key === "Stablecoin");
        const _daiAddr = dai.value;
        setAddress(_daiAddr, "liquidityTokenAddress");
      } catch (error) {
        console.error(error);
      }
    },
    [setAddress]
  );

  useEffect(() => {
    if (!networkId) return;
    if (!account) {
      getAddressFromApi(networkId);
      return;
    }
    const signerOrProvider = getProviderOrSigner(library, account, networkId);

    registry.Stablecoin.getAddress(networkId, signerOrProvider).then((_addr) =>
      setAddress(_addr, "liquidityTokenAddress")
    );

    registry.NPMToken.getAddress(networkId, signerOrProvider).then((_addr) =>
      setAddress(_addr, "NPMTokenAddress")
    );
  }, [account, getAddressFromApi, library, networkId, setAddress]);

  return (
    <AppConstantsContext.Provider
      value={{
        ...data,
        tvlLoaded,
        poolsTvl: tvl,
        getTVLById,
        getPriceByAddress,
      }}
    >
      {children}
    </AppConstantsContext.Provider>
  );
};
