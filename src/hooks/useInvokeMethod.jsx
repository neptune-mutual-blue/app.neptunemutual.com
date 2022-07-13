import { useTxPoster } from "@/src/context/TxPoster";

export const useInvokeMethod = () => {
  const { invoke, contractRead } = useTxPoster();

  return { invoke, contractRead };
};
