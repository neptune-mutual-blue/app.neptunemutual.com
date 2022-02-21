import { useUnlimitedApproval } from "@/src/context/UnlimitedApproval";
import { MaxUint256 } from "@ethersproject/constants";

export const useApprovalAmount = () => {
  const { unlimitedApproval } = useUnlimitedApproval();

  /**
   * @param {string} amount
   */
  const getApprovalAmount = (amount) => {
    if (unlimitedApproval) {
      return MaxUint256.toString();
    }

    return amount;
  };

  return {
    getApprovalAmount,
  };
};
