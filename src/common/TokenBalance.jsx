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
import { classNames } from "@/utils/classnames";

export const TokenBalance = ({
  tokenAddress,
  tokenDecimals,
  balance,
  unit,
  disabled,
  children,
}) => {
  const { networkId } = useNetwork();
  const { register } = useRegisterToken();
  const { account } = useWeb3React();
  const toast = useToast();
  const router = useRouter();

  const handleCopy = async (e) => {
    e && e.preventDefault();
    try {
      await navigator.clipboard.writeText(tokenAddress);
      toast.pushSuccess({
        title: t`Success`,
        message: t`Token address copied Successfully`,
        lifetime: SHORT_TOAST_TIME,
      });
    } catch (err) {
      // console.error(err);
      toast.pushError({
        title: t`Error`,
        message: t`Unable to copy token address`,
        lifetime: SHORT_TOAST_TIME,
      });
    }
  };

  return (
    <div
      className="flex items-start justify-between px-3 mt-2 text-9B9B9B"
      data-testid="token-balance-container"
    >
      <div>
        {balance && (
          <p
            title={
              formatCurrency(
                convertFromUnits(balance, tokenDecimals),
                router.locale,
                unit,
                true
              ).long
            }
            data-testid="balance"
          >
            <Trans>Balance:</Trans>{" "}
            {
              formatCurrency(
                convertFromUnits(balance, tokenDecimals),
                router.locale,
                unit,
                true
              ).short
            }
          </p>
        )}
        {children}
      </div>
      <div className="flex items-center">
        <button
          title="Copy token address"
          onClick={handleCopy}
          className={classNames(
            "ml-3",
            disabled && "pointer-events-none cursor-not-allowed"
          )}
          data-testid="copy-button"
        >
          <span className="sr-only">Copy token address</span>
          <CopyIcon width={18} fill="currentColor" />
        </button>
        <a
          href={getTokenLink(networkId, tokenAddress, account)}
          target="_blank"
          className={classNames(
            "ml-3",
            disabled && "pointer-events-none cursor-not-allowed"
          )}
          rel="noreferrer nofollow"
          title="Open In Explorer"
          data-testid="explorer-link"
        >
          <span className="sr-only">Open In Explorer</span>
          <OpenInNewIcon width={20} fill="currentColor" />
        </a>
        <button
          className={classNames(
            "ml-3",
            disabled && "pointer-events-none cursor-not-allowed"
          )}
          onClick={() => register(tokenAddress, unit, tokenDecimals)}
          title={"Add to Metamask"}
          data-testid="add-button"
        >
          <span className="sr-only">Add to Metamask</span>
          <AddCircleIcon width={20} fill="currentColor" />
        </button>
      </div>
    </div>
  );
};
