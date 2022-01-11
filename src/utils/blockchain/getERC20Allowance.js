import { Contract } from "@ethersproject/contracts";
import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import IERC20 from "../../config/contracts/abis/IERC20.json";

export const getERC20Allowance = async (
  spender,
  tokenAddress,
  library,
  account,
  networkId
) => {
  const signerOrProvider = getProviderOrSigner(library, account, networkId);

  if (!signerOrProvider) {
    console.log("No provider found");
  }

  const instance = new Contract(tokenAddress, IERC20, signerOrProvider);

  if (!instance) {
    console.log("No instance found");
  }

  const result = await instance.allowance(account, spender);

  return result;
};
