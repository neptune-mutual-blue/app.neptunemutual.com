import OpenInNewIcon from "@/icons/OpenInNewIcon";
import AddCircleIcon from "@/icons/AddCircleIcon";
import { convertFromUnits } from "@/utils/bn";
import { useRegisterToken } from "@/src/hooks/useRegisterToken";
import { useNetwork } from "@/src/context/Network";
import { getTokenLink } from "@/lib/connect-wallet/utils/explorer";
import { useWeb3React } from "@web3-react/core";
import CopyIcon from "@/icons/CopyIcon";
import { useToast } from "@/lib/toast/context";
import { SHORT_TOAST_TIME } from "@/src/config/toast";
import { formatCurrency } from "@/utils/formatter/currency";
import { t, Trans } from "@lingui/macro";
import { useRouter } from "next/router";

export const TokenBalance = ({ tokenAddress, balance, unit, children }) => {
  const { networkId } = useNetwork();
  const { register } = useRegisterToken();
  const { account } = useWeb3React();
  const toast = useToast();
  const router = useRouter();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(tokenAddress);
      toast?.pushSuccess({
        title: t`Success`,
        message: t`Token address copied Successfully`,
        lifetime: SHORT_TOAST_TIME,
      });
    } catch (err) {
      console.error(err);
      toast?.pushError({
        title: t`Error`,
        message: t`Unable to copy token address`,
        lifetime: SHORT_TOAST_TIME,
      });
    }
  };

  return (
    <div className="flex items-start justify-between px-3 mt-2 text-9B9B9B">
      <div>
        {balance && (
          <p title={formatCurrency(convertFromUnits(balance), router.locale, unit, true).long}>
            <Trans>Balance:</Trans>{" "}
            {formatCurrency(convertFromUnits(balance), router.locale,unit, true).short}
          </p>
        )}
        {children}
      </div>
      <div className="flex items-center">
        <button onClick={handleCopy} className="ml-3">
          <span className="sr-only">Copy token address</span>
          <CopyIcon width={18} fill="currentColor" />
        </button>
        <a
          href={getTokenLink(networkId, tokenAddress, account)}
          target="_blank"
          className="ml-3"
          rel="noreferrer nofollow"
        >
          <span className="sr-only">Open In Explorer</span>
          <OpenInNewIcon width={20} fill="currentColor" />
        </a>
        <button className="ml-3" onClick={() => register(tokenAddress, unit)}>
          <span className="sr-only">Add to Metamask</span>
          <AddCircleIcon width={20} fill="currentColor" />
        </button>
      </div>
    </div>
  );
};
