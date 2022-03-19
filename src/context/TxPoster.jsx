import React, { useCallback, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Modal } from "@/components/UI/molecules/modal/regular";
import { DEFAULT_GAS_LIMIT } from "@/src/config/constants";
import { getErrorMessage } from "@/src/helpers/tx";
import { useErrorNotifier } from "@/src/hooks/useErrorNotifier";
import { calculateGasMargin } from "@/utils/bn";
import { ModalCloseButton } from "@/components/UI/molecules/modal/close-button";
import { Divider } from "@/components/UI/atoms/divider";

const initValue = {
  // prettier-ignore
  invoke: async ({instance, methodName, overrides, catcher, args, retry, onTransactionResult}) => {}, // eslint-disable-line
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
  const { notifyError } = useErrorNotifier();
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
      catcher,
      args = [],
      retry = true,
      onTransactionResult = () => {},
    }) => {
      if (!instance) {
        catcher(new Error("Instance not found"));
        return;
      }

      let estimatedGas = null;
      try {
        estimatedGas = await instance.estimateGas[methodName](...args);
      } catch (err) {
        console.log(`Could not estimate gas for "${methodName}", args: `, args);

        if (retry) {
          notifyError(err, "estimate gas");
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
            },
          });
        }
      }

      if (!estimatedGas && retry) {
        return;
      }

      const tx = await instance[methodName](...args, {
        gasLimit: estimatedGas ? calculateGasMargin(estimatedGas) : undefined,
        ...overrides,
      });

      onTransactionResult(tx);
      return tx;
    },
    [notifyError]
  );

  const handleContinue = async () => {
    const { instance, methodName, overrides, args, onTransactionResult } =
      data.pendingInvokeArgs;

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
    return tx;
  };

  const handleClose = () => {
    setData({
      message: "",
      isError: false,
      pendingInvokeArgs: {},
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
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="relative inline-block w-full max-w-2xl px-8 py-12 text-left align-middle bg-f1f3f6 rounded-3xl">
        <Dialog.Title className="flex items-center">
          <div className="font-bold font-sora text-h2">
            EVM Error Occurred While Processing Your Request
          </div>
        </Dialog.Title>

        <ModalCloseButton onClick={onClose}></ModalCloseButton>

        <div className="my-12 mb-8">
          <p className="mt-8 text-DC2121">{message}</p>
        </div>

        <details open>
          <summary>More details</summary>
          <pre className="break-words whitespace-pre-wrap">{description}</pre>
        </details>

        <Divider />

        <p className="mb-8">
          We don&apos;t recommend doing this but you can forcibly send this
          transaction anyway.
        </p>

        <div className="flex justify-end">
          <button
            className="px-6 py-2 mr-8 border rounded border-4e7dd9 text-4e7dd9 hover:bg-4e7dd9 hover:bg-opacity-10"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-6 py-2 mr-8 border rounded border-DC2121 text-DC2121 hover:bg-DC2121 hover:text-white"
            onClick={handleContinue}
          >
            Send transaction ignoring this error
          </button>
        </div>
      </div>
    </Modal>
  );
};
