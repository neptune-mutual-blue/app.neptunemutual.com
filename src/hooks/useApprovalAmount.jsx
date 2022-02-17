import { MaxUint256 } from "@ethersproject/constants";

export const useApprovalAmount = () => {
  const unlimitedApproval = true;

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
