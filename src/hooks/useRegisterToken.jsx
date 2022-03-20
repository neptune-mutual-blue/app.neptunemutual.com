import { registerToken } from "@/lib/connect-wallet/utils/wallet";
import { useNetwork } from "@/src/context/Network";
import { useWeb3React } from "@web3-react/core";

export const useRegisterToken = () => {
  const { networkId } = useNetwork();
  const { account } = useWeb3React();

  const register = (address, symbol) => {
    if (!networkId || !account) return;

    registerToken(address, symbol, 18).then(console.log).catch(console.error);
  };

  return {
    register,
  };
};
