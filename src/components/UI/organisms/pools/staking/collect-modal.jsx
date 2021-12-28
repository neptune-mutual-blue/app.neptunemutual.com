import { useState } from "react";
import { RegularButton } from "@/components/UI/atoms/button/regular";
import { InputWithTrailingButton } from "@/components/UI/atoms/input/with-trailing-button";
import { Label } from "@/components/UI/atoms/label";
import { BalanceAndIcons } from "@/components/UI/molecules/balance-and-icons";
import { Modal } from "@/components/UI/molecules/modal";
import { TabNav } from "@/components/UI/molecules/tabnav";
import { amountFormatter } from "@/utils/formatter";
import { Dialog } from "@headlessui/react";
import CloseIcon from "@/icons/close";

export const CollectModal = ({
  id,
  isCollectModalOpen,
  onCollectModalClose,
  modalTitle,
  stakedAmount,
  earned,
}) => {
  const headers = [
    {
      name: "harvest",
      href: "#",
      displayAs: "Harvest",
    },
    {
      name: "withdraw",
      href: "#",
      displayAs: "Withdraw",
    },
  ];

  const [activeTab, setActiveTab] = useState("harvest");
  const [amtToWithdraw, setAmtToWithdraw] = useState();

  const handleCollectClickFromModal = (_id) => {
    //for further processing
    console.log("click from collect modal", _id);
    onCollectModalClose();
  };

  const changeActiveTab = (e) => {
    e.preventDefault();
    setActiveTab(e.target.text.toLowerCase());
  };

  const handleChooseMax = () => {
    const MAX_VALUE_TO_WITHDRAW = 10000;
    setAmtToWithdraw(MAX_VALUE_TO_WITHDRAW);
  };

  const handleChange = (e) => {
    setAmtToWithdraw(e.target.value);
  };

  return (
    <Modal isOpen={isCollectModalOpen} onClose={onCollectModalClose}>
      <div className="max-w-xl w-full inline-block bg-F1F3F6 align-middle text-left p-12 rounded-3xl relative">
        <Dialog.Title className="font-sora font-bold text-h2">
          {modalTitle}
        </Dialog.Title>
        <button
          onClick={onCollectModalClose}
          className="absolute right-12 top-7 flex justify-center items-center text-gray-300 hover:text-black focus:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-364253 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
        >
          <span className="sr-only">Close</span>
          <CloseIcon width={24} />
        </button>
        <div className="mt-6">
          <TabNav
            onClick={(e) => changeActiveTab(e)}
            headers={headers}
            activeTab={activeTab}
          />
          {activeTab == "harvest" ? (
            <>
              <div className="flex justify-between text-sm font-semibold px-1 mt-6">
                <span className="capitalize">Your Stake</span>
                <span className="text-right">You Earned</span>
              </div>
              <div className="flex justify-between text-sm px-1 pt-2">
                <span className="text-7398C0 uppercase">
                  {amountFormatter(stakedAmount)} NPM
                </span>
                <span className="text-right text-7398C0 uppercase">
                  {earned}
                </span>
              </div>
            </>
          ) : (
            <>
              <Label className="font-semibold mb-4 mt-6 uppercase">
                Amount You wish to withdraw
              </Label>
              <InputWithTrailingButton
                value={amtToWithdraw}
                buttonProps={{
                  children: "Max",
                  onClick: handleChooseMax,
                }}
                inputProps={{
                  id: "withdraw-amount",
                  placeholder: "Enter Amount",
                  value: amtToWithdraw,
                  onChange: handleChange,
                }}
              />
              <BalanceAndIcons value={amtToWithdraw} unit={"NPM"} />
            </>
          )}
        </div>
        <RegularButton
          onClick={(e) => handleCollectClickFromModal(id)}
          className={"w-full mt-8 p-6 text-h6 uppercase font-semibold"}
        >
          Collect
        </RegularButton>
      </div>
    </Modal>
  );
};
