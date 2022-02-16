import { useWeb3React } from "@web3-react/core";
import { ViewTxLink } from "@/components/common/ViewTxLink";
import { getTxLink } from "@/lib/connect-wallet/utils/explorer";
import { useToast } from "@/lib/toast/context";
import { TOAST_DEFAULT_TIMEOUT } from "@/src/config/toast";

export const useTxToast = () => {
  const { chainId } = useWeb3React();
  const toast = useToast();

  /**
   * push(tx, {
   *   pending: "Approving DAI",
   *   success: "Approved DAI Successfully",
   *   failure: "Could not approve DAI"
   * })
   */
  const push = async (tx, titles) => {
    const txLink = getTxLink(chainId, tx);

    toast?.pushSuccess({
      title: titles.pending,
      message: <ViewTxLink txLink={txLink} />,
      lifetime: TOAST_DEFAULT_TIMEOUT,
    });

    const receipt = await tx.wait(1);
    const type = receipt.status === 1 ? "Success" : "Error";

    if (type === "Success") {
      toast?.pushSuccess({
        title: titles.success,
        message: <ViewTxLink txLink={txLink} />,
        lifetime: TOAST_DEFAULT_TIMEOUT,
      });
      return true;
    } else {
      toast?.pushError({
        title: titles.failure,
        message: <ViewTxLink txLink={txLink} />,
        lifetime: TOAST_DEFAULT_TIMEOUT,
      });
      return false;
    }
  };

  return { push };
};
