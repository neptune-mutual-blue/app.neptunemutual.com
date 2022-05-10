import create from "zustand";
import { getTxLink } from "@/lib/connect-wallet/utils/explorer";
import { v4 as uuidv4 } from "uuid";
import { ViewTxLink } from "@/common/ViewTxLink";
import { TOAST_DEFAULT_TIMEOUT } from "@/src/config/toast";

const DEFAULT_INTERVAL = 30000;

export const useToastsStore = create((set, get) => ({
  toasts: [],
  toastActions: {
    push: ({ message, type, lifetime, title }) => {
      if (message) {
        const newItem = {
          id: uuidv4(),
          message: message,
          type: type,
          lifetime: lifetime || DEFAULT_INTERVAL,
          title,
        };

        set((state) => ({
          ...state,
          toasts: [...state.toasts, newItem],
        }));

        return newItem.id;
      }
    },
    pushError: ({ message, title = "Error", lifetime }) => {
      get().toastActions.push({ message, type: "Error", title, lifetime });
    },
    pushWarning: ({ message, title = "Warning", lifetime }) => {
      get().toastActions.push({ message, type: "Warning", title, lifetime });
    },
    pushSuccess: ({ message, title = "Success", lifetime }) => {
      get().toastActions.push({ message, type: "Success", title, lifetime });
    },
    pushInfo: ({ message, title = "Info", lifetime }) => {
      get().toastActions.push({ message, type: "Info", title, lifetime });
    },
    pushLoading: ({ message, title = "Loading", lifetime }) => {
      get().toastActions.push({ message, type: "Loading", title, lifetime });
    },
    pushCustom: ({ message, lifetime, icon, header }) => {
      if (message) {
        const newItem = {
          id: uuidv4(),
          message: message,
          lifetime: lifetime || DEFAULT_INTERVAL,
          icon: icon,
          header: header,
          type: undefined,
        };

        set((state) => ({
          ...state,
          toasts: [...state.toasts, newItem],
        }));
      }
    },
    remove: (id) => {
      set((state) => ({
        ...state,
        toasts: state.toasts.filter((e) => e.id !== id),
      }));
    },
  },
  txPush: async ({ tx, titles, options, networkId }) => {
    const { pushLoading, pushSuccess, pushError } = get().toastActions;

    if (!tx) {
      options?.onTxFailure && options.onTxFailure();
      return;
    }

    const txLink = getTxLink(networkId, tx);

    pushLoading({
      title: titles.pending,
      message: <ViewTxLink txLink={txLink} />,
      lifetime: TOAST_DEFAULT_TIMEOUT,
    });

    const receipt = await tx.wait(1);
    const type = receipt.status === 1 ? "Success" : "Error";

    if (type === "Success") {
      pushSuccess({
        title: titles.success,
        message: <ViewTxLink txLink={txLink} />,
        lifetime: TOAST_DEFAULT_TIMEOUT,
      });

      options?.onTxSuccess && options.onTxSuccess();
      return;
    }

    pushError({
      title: titles.failure,
      message: <ViewTxLink txLink={txLink} />,
      lifetime: TOAST_DEFAULT_TIMEOUT,
    });

    options?.onTxFailure && options.onTxFailure();
  },
}));

export const txToast = useToastsStore.getState().txPush;

export const toast = useToastsStore.getState().toastActions;
