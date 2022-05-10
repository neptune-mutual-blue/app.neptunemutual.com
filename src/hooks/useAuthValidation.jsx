import { SHORT_TOAST_TIME } from "@/src/config/toast";
import { useWeb3React } from "@web3-react/core";
import { toast } from "@/src/store/toast";

export const useAuthValidation = () => {
  const { account } = useWeb3React();

  const requiresAuth = () => {
    if (account) {
      return;
    }

    toast?.pushError({
      title: "Error",
      message: "Please connect your wallet",
      lifetime: SHORT_TOAST_TIME,
    });
  };

  return {
    requiresAuth,
  };
};
