import { useTxPoster } from "@/src/context/TxPoster";

export const useInvokeMethod = () => {
  const { invoke } = useTxPoster();

  return { invoke };
};
