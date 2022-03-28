import CloseIcon from "@/icons/CloseIcon";
import { NetworkNames } from "@/lib/connect-wallet/config/chains";
import { FAUCET_URL, LEADERBOARD_URL } from "@/src/config/constants";
import { testnetChainIds } from "@/src/config/environment";
import { useNetwork } from "@/src/context/Network";
import { useState } from "react";

export const Banner = () => {
  const { networkId } = useNetwork();
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
    <div className="relative bg-4e7dd9">
      <div className="flex items-center justify-center p-3 mx-auto my-0 text-sm text-white lg:py-3 max-w-7xl lg:px-7">
        <div className="flex items-center justify-center flex-auto min-w-0">
          <p>
            You&#x2019;re on {NetworkNames[networkId]} Network. Get{" "}
            <a
              className="underline"
              href={FAUCET_URL}
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              Test Tokens
            </a>{" "}
            or{" "}
            <a
              className="underline"
              href={LEADERBOARD_URL}
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              View Leaderboard
            </a>
            .
          </p>
        </div>
        <button onClick={handleClose} className="block p-1 ml-auto">
          <CloseIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
