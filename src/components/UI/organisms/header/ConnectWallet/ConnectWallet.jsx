import { useState } from "react";

import { useWeb3React } from "@web3-react/core";
import { networkId } from "@/src/config/environment";
import { useNotifier } from "@/src/hooks/useNotifier";
import useAuth from "@/lib/connect-wallet/hooks/useAuth";
import { ChainLogos, NetworkNames } from "@/lib/connect-wallet/config/chains";
import { Popup } from "./Popup";

export default function ConnectWallet() {
  const [isOpen, setIsOpen] = useState(false);
  const { active } = useWeb3React();

  const { notifier } = useNotifier();
  const { logout } = useAuth(networkId, notifier);

  function onClose() {
    setIsOpen(false);
  }

  function onOpen() {
    if (active) {
      logout();
    }

    setIsOpen(true);
  }

  let button = (
    <button
      className="inline-block bg-4E7DD9 text-sm leading-loose py-2 px-4 border border-transparent rounded-md font-medium text-white hover:bg-opacity-75"
      onClick={onOpen}
    >
      Connect Wallet
    </button>
  );

  if (active) {
    button = (
      <button
        className="inline-block bg-4E7DD9 text-sm leading-loose py-2 px-4 border border-transparent rounded-md font-medium text-white hover:bg-opacity-75"
        onClick={logout}
      >
        Disconnect
      </button>
    );
  }

  const ChainLogo = ChainLogos[networkId] || ChainLogos[1];

  const network = (
    <div className="inline-flex items-center bg-white text-9B9B9B text-sm leading-loose py-2 px-4 border border-transparent rounded-md font-medium">
      <ChainLogo width={24} height={24} />{" "}
      <p className="inline-block ml-2">
        {NetworkNames[networkId] || "Network"}
      </p>
    </div>
  );

  return (
    <>
      <div className="ml-10 space-x-4 py-5 flex border-l border-728FB2 sm:pl-6 lg:pl-8">
        {network} {button}
      </div>
      <Popup isOpen={isOpen} onClose={onClose} />
    </>
  );
}
