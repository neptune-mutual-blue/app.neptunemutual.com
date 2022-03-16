import CloseIcon from "@/icons/CloseIcon";
import { NetworkNames } from "@/lib/connect-wallet/config/chains";
import { FAUCET_URL, LEADERBOARD_URL } from "@/src/config/constants";
import { testnetChainIds } from "@/src/config/environment";
import { useAppContext } from "@/src/context/AppWrapper";
import { useState } from "react";

export const Banner = () => {
  const { networkId } = useAppContext();
  const [show, setShow] = useState(true);

  const isTestnet = testnetChainIds.indexOf(networkId) > -1;

  if (!networkId || !isTestnet) {
    return null;
  }

  const handleClose = () => {
    setShow(false);
  };

  if (!show) return <></>;

  return (
    <div className="relative text-sm text-center text-white bg-4e7dd9">
      <div className="px-3 py-3 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <p className="sm:ml-3">
          You&#x2019;re on {NetworkNames[networkId]} Network. Get{" "}
          <a
            className="underline"
            href={FAUCET_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Test Tokens
          </a>{" "}
          or{" "}
          <a
            className="underline"
            href={LEADERBOARD_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Leaderboard
          </a>
          .
        </p>
      </div>
      <button
        onClick={handleClose}
        className="absolute transform -translate-y-1/2 right-2 sm:right-10 xl:right-14 top-1/2"
      >
        <CloseIcon className="w-5 h-5" />
      </button>
    </div>
  );
};
