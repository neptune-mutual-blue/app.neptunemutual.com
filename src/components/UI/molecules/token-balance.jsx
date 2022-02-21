import OpenInNewIcon from "@/icons/OpenInNewIcon";
import AddCircleIcon from "@/icons/AddCircleIcon";
import { convertFromUnits } from "@/utils/bn";
import { useRegisterToken } from "@/src/hooks/useRegisterToken";
import { useAppContext } from "@/src/context/AppWrapper";
import { getTokenLink } from "@/lib/connect-wallet/utils/explorer";
import { useWeb3React } from "@web3-react/core";
import CopyIcon from "@/icons/CopyIcon";
import { useToast } from "@/lib/toast/context";
import { SHORT_TOAST_TIME } from "@/src/config/toast";
import { formatCurrency } from "@/utils/formatter/currency";

export const TokenBalance = ({ tokenAddress, balance, unit, children }) => {
  const { networkId } = useAppContext();
  const { register } = useRegisterToken();
  const { account } = useWeb3React();
  const toast = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(tokenAddress);
      toast?.pushSuccess({
        title: "Success",
        message: "Token address copied Successfully",
        lifetime: SHORT_TOAST_TIME,
      });
    } catch (error) {
      console.error(error);
      toast?.pushError({
        title: "Error",
        message: "Unable to copy token address",
        lifetime: SHORT_TOAST_TIME,
      });
    }
  };

  return (
    <div className="flex justify-between items-start text-9B9B9B px-3 mt-2">
      <div>
        {balance && (
          <p title={formatCurrency(convertFromUnits(balance), unit, true).long}>
            Balance:{" "}
            {formatCurrency(convertFromUnits(balance), unit, true).short}
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
          rel="noreferrer"
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
