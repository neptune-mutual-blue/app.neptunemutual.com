import React, { useCallback, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ModalRegular } from "@/common/Modal/ModalRegular";
import { DEFAULT_GAS_LIMIT } from "@/src/config/constants";
import { getErrorMessage } from "@/src/helpers/tx";
import { calculateGasMargin } from "@/utils/bn";
import { Divider } from "@/common/Divider/Divider";
import { ModalWrapper } from "@/common/Modal/ModalWrapper";
import { useTransactionHistory } from "@/src/hooks/useTransactionHistory";

const initValue = {
  // prettier-ignore
  invoke: async ({instance, methodName, overrides = {},  args = [], retry = true, onTransactionResult, onRetryCancel, onError}) => {}, // eslint-disable-line
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
    description: "",
    message: "",
    isError: false,
    pendingInvokeArgs: {},
  });

  useTransactionHistory();

  const invoke = useCallback(
    async ({
      instance,
      methodName,
      overrides = {},

      args = [],
      retry = true,
      onTransactionResult = (_tx) => {},
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
        description: "",
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
        description: "",
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
      <ModalWrapper className="max-w-xs sm:max-w-2xl bg-FEFEFF">
        <Dialog.Title className="flex items-center">
          <div className="font-semibold text-black font-sora text-h4">
            EVM Error Occurred While Processing Your Request
          </div>
        </Dialog.Title>

        <div className="overflow-y-auto max-h-56">
          <div className="my-5">
            <p className="text-sm leading-5 text-404040 font-poppins">
              We attempted to submit your transaction but ran into an unexpected
              error. The smart contract sent the following error message:
            </p>
          </div>

          <div className="mb-5">
            <p className="text-940000">{message}</p>
          </div>

          <div className="mb-4 text-940000">
            <p className="break-words whitespace-pre-wrap">{description}</p>
          </div>
        </div>

        <Divider className="mt-0 mb-4" />

        <div className="mb-5">
          <p className="text-sm leading-5 text-404040 font-poppins">
            While we do not suggest it, you may force this transaction to be
            sent nonetheless.
          </p>
        </div>

        <div className="flex flex-col justify-end sm:flex-row">
          <button
            className="w-full p-3 mb-4 border rounded sm:mb-0 sm:mr-6 sm:w-auto border-9B9B9B text-9B9B9B hover:bg-9B9B9B hover:bg-opacity-10"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="w-full p-3 border rounded sm:w-auto border-E52E2E text-E52E2E hover:bg-E52E2E hover:text-white"
            onClick={handleContinue}
          >
            Send Transaction Ignoring This Error
          </button>
        </div>
      </ModalWrapper>
    </ModalRegular>
  );
};
