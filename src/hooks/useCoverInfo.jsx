import { useCovers } from "@/src/context/Covers";

export const useCoverInfo = (key) => {
  const { getInfoByKey } = useCovers();

  return {
    coverInfo: getInfoByKey(key),
  };
};
