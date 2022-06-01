import { registerToken } from "@/lib/connect-wallet/utils/wallet";
import { API_BASE_URL } from "@/src/config/constants";
import { useNetwork } from "@/src/context/Network";
import { useWeb3React } from "@web3-react/core";
import { useState } from "react";

export const useRegisterToken = () => {
  const { networkId } = useNetwork();
  const { account } = useWeb3React();
  const [isImageAvailable, setIsImageAvailable] = useState(false);

  const register = async (address, symbol) => {
    if (!networkId || !account) return;
    symbol &&
      (await fetch(
        `${API_BASE_URL}images/tokens/${symbol.toLowerCase()}.svg`
      ).then((res) => {
        if (res.status != "404") {
          setIsImageAvailable(true);
        }
      }));
    const image = isImageAvailable
      ? `${API_BASE_URL}/images/tokens/${symbol.toLowerCase()}.svg`
      : undefined;

    registerToken(address, symbol, 18, image)
      .then(console.log)
      .catch(console.error);
  };

  return {
    register,
  };
};
