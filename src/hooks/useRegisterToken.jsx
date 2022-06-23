import { registerToken } from "@/lib/connect-wallet/utils/wallet";
import { API_BASE_URL } from "@/src/config/constants";
import { useNetwork } from "@/src/context/Network";
import { useWeb3React } from "@web3-react/core";

export const useRegisterToken = () => {
  const { networkId } = useNetwork();
  const { account } = useWeb3React();

  const register = (address, symbol, decimals = 18) => {
    if (!networkId || !account) return;

    const image = symbol
      ? `${API_BASE_URL}images/tokens/${symbol.toLowerCase()}.svg`
      : undefined;

    registerToken(address, symbol, decimals, image)
      .then(console.log)
      .catch(console.error);
  };

  return {
    register,
  };
};
