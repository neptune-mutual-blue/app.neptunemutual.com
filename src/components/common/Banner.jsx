import CloseIcon from "@/icons/CloseIcon";
import { NetworkNames } from "@/lib/connect-wallet/config/chains";
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
    <div className="relative bg-4e7dd9 text-white text-sm text-center">
      <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
        <p className="ml-3">
          You are using {NetworkNames[networkId]}. Please{" "}
          <a
            className="underline"
            href="https://faucet.hicif.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            click here
          </a>{" "}
          to get testnet tokens.
        </p>
      </div>
      <button
        onClick={handleClose}
        className="absolute right-7 sm:right-10 xl:right-14 top-1/2 transform -translate-y-1/2"
      >
        <CloseIcon className="w-5 h-5" />
      </button>
    </div>
  );
};
