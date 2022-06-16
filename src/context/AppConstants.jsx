import React, { useEffect, useState } from "react";

import { useNetwork } from "@/src/context/Network";
import { usePoolsTVL } from "@/src/hooks/usePoolsTVL";
import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { useWeb3React } from "@web3-react/core";

import {
  getAddressesFromApi,
  getAddressesFromProvider,
} from "@/src/services/contracts/getAddresses";

const initValue = {
  liquidityTokenAddress: "",
  NPMTokenAddress: "",
  NPMTokenDecimals: 18,
  NPMTokenSymbol: "NPM",
  liquidityTokenDecimals: 6,
  liquidityTokenSymbol: "DAI",
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

  useEffect(() => {
    if (!networkId) return;
    if (!account) {
      getAddressesFromApi(networkId).then((result) => {
        const {
          NPMTokenAddress,
          liquidityTokenAddress,
          NPMTokenDecimals,
          NPMTokenSymbol,
          liquidityTokenDecimals,
          liquidityTokenSymbol,
        } = result;

        setData((prev) => ({
          ...prev,
          NPMTokenAddress,
          liquidityTokenAddress,
          NPMTokenDecimals,
          NPMTokenSymbol,
          liquidityTokenDecimals,
          liquidityTokenSymbol,
        }));
      });
      return;
    }
    const signerOrProvider = getProviderOrSigner(library, account, networkId);

    getAddressesFromProvider(networkId, signerOrProvider).then((result) => {
      const {
        NPMTokenAddress,
        liquidityTokenAddress,
        NPMTokenDecimals,
        NPMTokenSymbol,
        liquidityTokenDecimals,
        liquidityTokenSymbol,
      } = result;

      setData((prev) => ({
        ...prev,
        NPMTokenAddress,
        liquidityTokenAddress,
        NPMTokenDecimals,
        NPMTokenSymbol,
        liquidityTokenDecimals,
        liquidityTokenSymbol,
      }));
    });
  }, [account, library, networkId]);

  return (
    <AppConstantsContext.Provider
      value={{ ...data, poolsTvl: tvl, getTVLById, getPriceByAddress }}
    >
      {children}
    </AppConstantsContext.Provider>
  );
};
