import React, { useEffect, useState } from "react";
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
  const { tvl, getTVLById, getPriceByAddress } = usePoolsTVL(
    data.NPMTokenAddress
  );
  const { library, account } = useWeb3React();

  const setAddress = (_address, key) => {
    setData((prev) => ({
      ...prev,
      [key]: _address,
    }));
  };

  const getAddressFromApi = async (networkId) => {
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
      const findNPM = data.find((item) => item.key === "NPM");
      const _addr = findNPM["value"];
      setAddress(_addr, "NPMTokenAddress");

      const findDAI = data.find((item) => item.key === "Stablecoin");
      const _daiAddr = findDAI["value"];
      setAddress(_daiAddr, "liquidityTokenAddress");
    } catch (error) {
      console.error(error);
    }
  };

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
  }, [account, library, networkId]);

  return (
    <AppConstantsContext.Provider
      value={{ ...data, poolsTvl: tvl, getTVLById, getPriceByAddress }}
    >
      {children}
    </AppConstantsContext.Provider>
  );
};
