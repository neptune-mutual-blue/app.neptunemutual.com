import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { useWeb3React } from "@web3-react/core";

import useAuth from "@/lib/connect-wallet/hooks/useAuth";
import { wallets } from "@/lib/connect-wallet/config/wallets";
import { Disclaimer } from "./Disclaimer";
import { WalletList } from "./WalletList";
import { networkId } from "@/src/config/environment";
import { useNotifier } from "@/src/hooks/useNotifier";
import { ModalCloseButton } from "@/components/UI/molecules/modal/close-button";
import { Modal } from "@/components/UI/molecules/modal/regular";
import { Loader } from "@/components/UI/atoms/Loader/Loader";

export const Popup = ({ isOpen, onClose }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const { active } = useWeb3React();

  const { notifier } = useNotifier();
  const { login } = useAuth(networkId, notifier);

  useEffect(() => {
    if (!isOpen) setIsConnecting(false);

    if (active) {
      setIsConnecting(false);
      onClose();
    }
  }, [isOpen, active, onClose]);

  const onConnect = (id) => {
    setIsConnecting(true);
    const wallet = wallets.find((x) => x.id === id);
    const connectorName = wallet.connectorName;
    login(connectorName);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="relative inline-block max-w-md p-12 my-8 text-left align-middle transition-all rounded-3xl bg-F1F3F6">
        <Dialog.Title
          as="h3"
          className="font-sora text-h2 font-bold text-black leading-9"
        >
          Connect Wallet
        </Dialog.Title>

        <ModalCloseButton onClick={onClose}></ModalCloseButton>

        {!isConnecting && (
          <>
            <Disclaimer />
            <WalletList wallets={wallets} onConnect={onConnect} />
          </>
        )}

        {isConnecting && (
          <>
            <div className="mt-8 flex justify-left items-center">
              <Loader />
              <p className="">Connecting</p>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};
