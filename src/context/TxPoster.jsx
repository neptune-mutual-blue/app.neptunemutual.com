import React, { useCallback, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ModalRegular } from "@/common/Modal/ModalRegular";
import { DEFAULT_GAS_LIMIT } from "@/src/config/constants";
import { getErrorMessage } from "@/src/helpers/tx";
import { calculateGasMargin } from "@/utils/bn";
import { ModalCloseButton } from "@/common/Modal/ModalCloseButton";
import { Divider } from "@/common/Divider/Divider";

const initValue = {
  // prettier-ignore
  invoke: async ({instance, methodName, overrides = {},  args = [], retry, onTransactionResult, onRetryCancel, onError}) => {}, // eslint-disable-line
};

const TxPosterContext = React.createContext(initValue);

export function useTxPoster() {
  const context = React.useContext(TxPosterContext);
  if (context === undefined) {
    throw new Error("useTxPoster must be used within a TxPosterProvider");
  }
  return context;
}

export const TxPosterProvider = ({ children }) => {
  const [data, setData] = useState({
    message: "",
    isError: false,
    pendingInvokeArgs: {},
  });

  const invoke = useCallback(
    async ({
      instance,
      methodName,
      overrides = {},

      args = [],
      retry = true,
      onTransactionResult = () => {},
      onRetryCancel = () => {},
      onError = console.error,
    }) => {
      if (!instance) {
        onError(new Error("Instance not found"));
        return;
      }

      let estimatedGas = null;
      try {
        estimatedGas = await instance.estimateGas[methodName](...args);
      } catch (err) {
        console.log(`Could not estimate gas for "${methodName}", args: `, args);

        if (retry) {
          onError(err);
          setData({
            description: `Could not estimate gas for "${methodName}", args: ${JSON.stringify(
              args
            )}`,
            message: getErrorMessage(err),
            isError: true,
            pendingInvokeArgs: {
              instance,
              methodName,
              overrides,
              args,
              onTransactionResult,
              onRetryCancel,
              onError,
            },
          });
        }
      }

      if (!estimatedGas && retry) {
        // Could not estimate gas, therefore could not proceed
        // Shows popup and wait for confirmation
        return;
      }

      try {
        const tx = await instance[methodName](...args, {
          gasLimit: estimatedGas ? calculateGasMargin(estimatedGas) : undefined,
          ...overrides,
        });

        onTransactionResult(tx);
      } catch (err) {
        onError(err);
      }
    },
    []
  );

  const handleContinue = async () => {
    const {
      instance,
      methodName,
      overrides,
      args,
      onTransactionResult,
      onError,
    } = data.pendingInvokeArgs;

    try {
      // Closes modal and clears data
      setData({
        message: "",
        isError: false,
        pendingInvokeArgs: {},
      });

      const tx = await instance[methodName](...args, {
        gasLimit: DEFAULT_GAS_LIMIT,
        ...overrides,
      });

      onTransactionResult(tx);
    } catch (err) {
      onError(err);
    }
  };

  const handleClose = () => {
    setData((prevData) => {
      const { onRetryCancel } = prevData.pendingInvokeArgs;
      onRetryCancel && onRetryCancel();

      return {
        message: "",
        isError: false,
        pendingInvokeArgs: {},
      };
    });
  };

  const contextValue = {
    ...data,
    invoke,
  };

  return (
    <TxPosterContext.Provider value={contextValue}>
      {children}
      <ForceTxModal
        isOpen={data.isError}
        onClose={handleClose}
        message={data.message}
        description={data.description}
        handleContinue={handleContinue}
      />
    </TxPosterContext.Provider>
  );
};

const ForceTxModal = ({
  isOpen,
  onClose,
  message,
  description,
  handleContinue,
}) => {
  return (
    <ModalRegular isOpen={isOpen} onClose={onClose}>
      <div className="border-[1.5px] border-[#B0C4DB] relative inline-block w-full max-w-[699px] py-8 px-10 text-left align-middle bg-[#FEFEFF] rounded-3xl">
        <Dialog.Title className="flex items-center">
          <div className="font-sora text-[19px] leading-6 font-semibold text-[#01052D]">
            EVM Error Occurred While Processing Your Request
          </div>
        </Dialog.Title>

        <ModalCloseButton onClick={onClose}></ModalCloseButton>
        
        <div className="overflow-y-auto max-h-[200px] scrollbar">
          <div className="my-5">
            <p className="text-[#404040] text-sm leading-[21px] font-poppins">We attempted to submit your transaction but ran into an unexpected error. The smart contract sent the following error message:</p>
          </div>

          <div className="mb-5">
          <p className="text-[#940000]">{message}</p>
          </div>

          <details open className="mb-4 text-[#940000]">
            <summary>More details</summary>
            <pre className="break-words whitespace-pre-wrap">{description}</pre>
          </details>
        </div>

        <Divider className="mt-0 mb-4" />

        <div className="mb-5">
            <p className="text-[#404040] text-sm leading-[21px] font-poppins">
                While we do not suggest it, you may force this transaction to be sent nonetheless.
            </p>
        </div>

        <div className="flex justify-end">
          <button
            className="p-3 mr-8 border rounded border-9B9B9B text-9B9B9B hover:bg-9B9B9B hover:bg-opacity-10"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="p-3 mr-8 border rounded border-[#E52E2E] text-[#E52E2E] hover:bg-[#E52E2E] hover:text-white"
            onClick={handleContinue}
          >
            Send Transaction Ignoring This Error
          </button>
        </div>
      </div>
    </ModalRegular>
  );
};
