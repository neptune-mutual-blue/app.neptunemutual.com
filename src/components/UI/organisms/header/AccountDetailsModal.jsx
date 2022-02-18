import { Dialog } from "@headlessui/react";
import CloseIcon from "@/icons/CloseIcon";
import CopyIcon from "@/icons/CopyIcon";
import OpenInNewIcon from "@/icons/OpenInNewIcon";
import { wallets } from "@/lib/connect-wallet/config/wallets";
import { getAddressLink } from "@/lib/connect-wallet/utils/explorer";
import Identicon from "@/components/UI/organisms/header/Identicon";
import { useEffect, useState } from "react";
import CheckCircleIcon from "@/icons/CheckCircleIcon";
import { Modal } from "@/components/UI/molecules/modal/regular";
import ToggleButton from "@/components/UI/atoms/toggle";

const CopyAddressComponent = ({ account }) => {
  const [copyAddress, setCopyAddress] = useState(false);

  const timeOut = () =>
    setTimeout(() => {
      setCopyAddress(false);
    }, [1000]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(account);
    setCopyAddress(true);
    timeOut();
  };

  useEffect(() => {
    return () => {
      clearTimeout(timeOut());
    };
  }, []);

  return (
    <div className="flex items-center cursor-pointer" onClick={handleCopy}>
      {!copyAddress ? (
        <>
          <CopyIcon className="text-999BAB w-4 h-4" />
          <span className="text-21AD8C text-xs tracking-normal ml-2.5">
            Copy Address
          </span>
        </>
      ) : (
        <>
          <CheckCircleIcon className="text-999BAB w-4 h-4" />
          <span className="text-21AD8C text-xs tracking-normal ml-2.5">
            Copied
          </span>
        </>
      )}
    </div>
  );
};

export const AccountDetailsModal = ({
  isOpen,
  onClose,
  networkId,
  handleDisconnect,
  account,
}) => {
  const network = wallets.find((x) => x.id == "1");

  const [toggleOpen, setToggleOpen] = useState(false);

  const handleToggleClick = () => {
    setToggleOpen((prev) => !prev);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="relative inline-block min-w-sm max-w-xl px-16 py-12 my-8 text-left align-middle transition-all rounded-3xl bg-f1f3f6">
        <Dialog.Title
          as="h3"
          className="font-sora text-h2 font-bold text-black leading-9"
        >
          Account
        </Dialog.Title>

        <button
          onClick={onClose}
          className="absolute top-7 right-12 flex justify-center items-center text-black hover:text-4e7dd9 focus:text-4e7dd9 focus:outline-none focus-visible:ring-2 focus-visible:ring-black rounded-md focus-visible:ring-offset-transparent"
        >
          <span className="sr-only">Close</span>
          <CloseIcon width={24} height={24} />
        </button>

        <div className="mt-7 border border-B0C4DB bg-white rounded-big p-4">
          <div className="flex items-center justify-between">
            <span className="text-364253 text-xs tracking-normal whitespace-nowrap flex items-center">
              <span>Connected With {network.name}</span>
              <span className="ml-2">
                {<network.Icon width={12} height={12} />}
              </span>
            </span>
            <button
              onClick={handleDisconnect}
              className="border border-4e7dd9 ml-28 rounded-lg py-1 px-2 text-xxs text-4e7dd9"
            >
              Disconnect
            </button>
          </div>

          <div className="mt-3 flex items-center font-sora font-bold text-404040">
            {account ? <Identicon account={account} /> : <div />}
            <div className="ml-3">
              {account?.substring(0, 6) + "..." + account?.slice(-4)}
            </div>
          </div>

          <div className="py-2 flex">
            <CopyAddressComponent account={account} />
            <a
              href={getAddressLink(networkId, account)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center ml-6 cursor-pointer"
            >
              <OpenInNewIcon width={16} height={16} fill="#999BAB" />
              <span className="text-21AD8C text-xs tracking-normal ml-2.5">
                View on Explorer
              </span>
            </a>
          </div>
        </div>

        <div className="w-full mt-8 border bg-white border-B0C4DB rounded-big p-5 flex flex-col">
          <div className="flex w-full justify-between">
            <p className="text-h5 text-364253">Unlimited Approvals</p>
            <ToggleButton handleClick={handleToggleClick} isOpen={toggleOpen} />
          </div>
          <p className="text-999BAB mt-3 text-xs tracking-normal">
            If you do not want to keep approving for each transaction, enable
            this box.
          </p>
        </div>
      </div>
    </Modal>
  );
};
