import OpenInNewIcon from "@/icons/OpenInNewIcon";
import { getTxLink } from "@/lib/connect-wallet/utils/explorer";
import { useAppContext } from "@/src/context/AppWrapper";
import { classNames } from "@/utils/classnames";

export const IncidentReporter = ({ variant, account, txHash }) => {
  const { networkId } = useAppContext();

  return (
    <>
      <div className="flex items-center text-sm mb-4">
        <div
          className={classNames(
            "w-3 h-3 mr-2 rounded rotate-45",
            variant === "success" ? "bg-21AD8C" : "bg-FA5C2F"
          )}
        ></div>

        <div className="text-4e7dd9">{account}</div>

        {/* Link to reported tx */}
        <div className="ml-auto flex justify-center items-center">
          <a
            href={getTxLink(networkId, { hash: txHash })}
            target="_blank"
            rel="noreferrer noopener"
            className="p-1 text-black"
          >
            <span className="sr-only">Open in explorer</span>
            <OpenInNewIcon className="h-4 w-4" />
          </a>
        </div>
      </div>
    </>
  );
};
