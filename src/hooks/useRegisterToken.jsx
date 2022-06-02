import { registerToken } from "@/lib/connect-wallet/utils/wallet";
import { API_BASE_URL } from "@/src/config/constants";
import { useNetwork } from "@/src/context/Network";
import { useWeb3React } from "@web3-react/core";

export const useRegisterToken = () => {
  const { networkId } = useNetwork();
  const { account } = useWeb3React();

  const fetchImage = async (symbol) => {
    let image = undefined;
    if (symbol) {
      const res = await fetch(
        `${API_BASE_URL}images/tokens/${symbol.toLowerCase()}.svg`
      );
      if (res.status != 404)
        image = `${API_BASE_URL}images/tokens/${symbol.toLowerCase()}.svg`;
    }
    return image;
  };

  const register = async (address, symbol) => {
    if (!networkId || !account) return;
    const image = await fetchImage(symbol);
    registerToken(address, symbol, 18, image)
      .then(console.log)
      .catch(console.error);
  };

  return {
    register,
  };
};
