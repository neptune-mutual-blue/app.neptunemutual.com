import { ViewTxLink } from "@/components/common/ViewTxLink";
import { getTxLink } from "@/lib/connect-wallet/utils/explorer";
import { useToast } from "@/lib/toast/context";
import { TOAST_DEFAULT_TIMEOUT } from "@/src/config/toast";
import { useNetwork } from "@/src/context/Network";

export const useTxToast = () => {
  const { networkId } = useNetwork();
  const toast = useToast();

  /**
   *
   * @param {*} tx
   * @param {{pending: string, success: string, failure: string}} titles
   * @param {{onTxSuccess: function, onTxFailure: function}} options
   */
  const push = async (tx, titles, options = {}) => {
    if (!tx) {
      return;
    }

    const txLink = getTxLink(networkId, tx);

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

      options?.onTxSuccess();
      return;
    }

    toast?.pushError({
      title: titles.failure,
      message: <ViewTxLink txLink={txLink} />,
      lifetime: TOAST_DEFAULT_TIMEOUT,
    });
    options?.onTxFailure();
  };

  return { push };
};
