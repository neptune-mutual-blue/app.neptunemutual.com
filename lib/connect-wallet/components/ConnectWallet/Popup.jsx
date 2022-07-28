import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useWeb3React } from "@web3-react/core";

import useAuth from "../../hooks/useAuth";
import { wallets } from "../../config/wallets";
import { Modal } from "../Modal/Modal";
import { Disclaimer } from "../ConnectWallet/Disclaimer";
import { WalletList } from "../ConnectWallet/WalletList";
import { Loader } from "../Loader/Loader";
import CloseIcon from "../icons/CloseIcon";
import { ModalWrapper } from "@/common/Modal/ModalWrapper";

export const Popup = ({ isOpen, onClose, networkId, notifier }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const { active } = useWeb3React();

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
    <Modal isOpen onClose={onClose}>
      <ModalWrapper className="min-w-345 md:min-w-400 max-w-md my-2 transition-all bg-f1f3f6">
        <Dialog.Title
          as="h3"
          className="font-bold leading-9 text-black font-sora text-h2"
        >
          Connect Wallet
        </Dialog.Title>

        <button
          onClick={onClose}
          className="absolute flex items-center justify-center text-black rounded-md top-5 md:top-7 right-8 md:right-12 hover:text-4e7dd9 focus:text-4e7dd9 focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-transparent"
        >
          <span className="sr-only">Close</span>
          <CloseIcon width={24} height={24} />
        </button>

        {!isConnecting && (
          <>
            <Disclaimer />
            <WalletList wallets={wallets} onConnect={onConnect} />
          </>
        )}

        {isConnecting && (
          <>
            <div className="flex items-center mt-8 justify-left">
              <Loader />
              <p className="">Connecting</p>
            </div>
          </>
        )}
      </ModalWrapper>
    </Modal>
  );
};
