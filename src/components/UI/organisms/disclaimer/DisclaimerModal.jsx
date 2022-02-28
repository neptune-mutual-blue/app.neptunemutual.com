import { Modal } from "@/components/UI/molecules/modal/regular";
import { useLocalStorage } from "@/src/hooks/useLocalStorage";
import { classNames } from "@/utils/classnames";
import { Dialog } from "@headlessui/react";
import { useState } from "react";
// import styles from "./styles.module.css";

export const DisclaimerModal = () => {
  const [disclaimerApproval, setDisclaimerApproval] = useLocalStorage(
    "disclaimerApproval",
    false
  );
  const [isOpen, setIsOpen] = useState(!disclaimerApproval);
  const [isAgreed, setIsAgreed] = useState(false);

  const handleAccept = () => {
    setDisclaimerApproval(true);
    setIsOpen(false);
  };

  const handleDecline = () => {
    setIsOpen(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} disabled>
      <div className="max-w-5xl w-full inline-block bg-white align-middle text-left p-12 rounded-3xl relative">
        <Dialog.Title className="font-sora font-bold text-h4 flex items-center">
          Disclaimer and Warranty
        </Dialog.Title>
        <Dialog.Description
          className={classNames(
            "mt-6 text-sm leading-5 text-404040 flex flex-col gap-4 max-h-144 md:max-h-96 overflow-y-auto pr-1"
            // styles.scroll_container
          )}
        >
          <span>
            This testnet environment is built by Neptune Mutual, i.e. its
            operating entity Neptune Tech Limited and/or its affiliated
            companies (collectively “Neptune”).
          </span>
          <span>
            The purpose of this testnet environment is to test and conduct
            experiment on Neptune Mutual protocol without imposing risk to any
            digital assets or the main chain. Hence, this testnet environment is
            furnished for testing and experimenting only, and is subject to
            continuous updating, changing, improving, and/or periodically shut
            down without notice. The testnet environment may be malfunctioned,
            include technical errors or typographical errors. Any content,
            information, data, logo, including but not limited to covers
            providers, liquidity, protection policy are fictitious and should
            not be construed as a commitment by Neptune, and without warranties
            implied or statutory including without limitation warranties of
            merchantability, fitness for a particular use and non-infringement.
            Neptune accepts no responsibility or liability from any visitors on
            the testnet with regard to any issue incurred as a result of using
            or visiting the testnet environment.
          </span>
          <span>
            The cover creators, covers, covers availability, liquidity volume,
            protection amount, utilization ratio, as well as any other content
            in the testnet are fictitious and solely for the purpose of testing
            and experimenting. Neptune does not guarantee or warrant such
            information or content will be similar or close to the actual
            environment when the mainnet deploys. The logos and cover creators
            placed on the testnet are not intended to imply any official
            endorsement or commitment by those creators.
          </span>
          <span>
            Neptune may change this disclaimer at any time without notice to you
            and without liability to you or any other party. It is your
            responsibility to periodically check this disclaimer for changes. If
            you do not agree to any changes made to this disclaimer, you should
            cease use of this testnet.
          </span>
        </Dialog.Description>

        <div className="border-t border-f1f3f6 my-2"></div>

        <div className="flex items-start gap-2 mt-3">
          <input
            type={"checkbox"}
            id="agreement-checkbox"
            className="mt-1 cursor-pointer"
            checked={isAgreed}
            onChange={(e) => setIsAgreed(e.target.checked)}
          />
          <label
            htmlFor="agreement-checkbox"
            className="text-sm leading-6 text-404040 cursor-pointer"
          >
            By visiting this testnet environment, you acknowledge and agree the
            disclaimer as above and/or any changes made to this disclaimer.
          </label>
        </div>

        <div className="w-full flex justify-end gap-6 mt-6">
          <button
            className="border border-4e7dd9 text-h6 font-medium rounded-md p-3 text-4e7dd9"
            onClick={handleDecline}
          >
            Decline
          </button>
          <button
            className={classNames(
              "border border-4e7dd9 text-h6 font-medium rounded-md p-3 text-white bg-4e7dd9",
              isAgreed
                ? "bg-opacity-100 cursor-pointer pointer-events-auto"
                : "bg-opacity-75 cursor-not-allowed pointer-events-none"
            )}
            onClick={handleAccept}
          >
            Accept
          </button>
        </div>
      </div>
    </Modal>
  );
};
