import { registerToken } from "@/lib/connect-wallet/utils/wallet";
import { useWeb3React } from "@web3-react/core";

export const useRegisterToken = () => {
  const { chainId, account } = useWeb3React();

  const register = (address, symbol) => {
    if (!chainId || !account) return;

    registerToken(address, symbol, 18).then(console.log).catch(console.error);
  };

  return {
    register,
  };
};
