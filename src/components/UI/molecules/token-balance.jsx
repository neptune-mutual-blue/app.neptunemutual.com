import OpenInNewIcon from "@/icons/open-in-new";
import AddCircleIcon from "@/icons/add-circle";
import { convertFromUnits } from "@/utils/bn";
import { useRegisterToken } from "@/src/hooks/useRegisterToken";
import { useAppContext } from "@/src/context/AppWrapper";
import { getAddressLink } from "@/lib/connect-wallet/utils/explorer";

export const TokenBalance = ({ tokenAddress, balance, unit, children }) => {
  const { networkId } = useAppContext();
  const { register } = useRegisterToken();

  return (
    <div className="flex justify-between items-start text-9B9B9B px-3 mt-2">
      <div>
        {balance && (
          <p>
            Balance: {convertFromUnits(balance).toString()} {unit}
          </p>
        )}
        {children}
      </div>
      <div className="flex">
        <a
          href={getAddressLink(networkId, tokenAddress)}
          target="_blank"
          className="ml-3"
          rel="noreferrer"
        >
          <span className="sr-only">Open In Explorer</span>
          <OpenInNewIcon width={24} fill="currentColor" />
        </a>
        <button className="ml-3" onClick={() => register(tokenAddress, unit)}>
          <span className="sr-only">Add to Metamask</span>
          <AddCircleIcon width={24} fill="currentColor" />
        </button>
      </div>
    </div>
  );
};
