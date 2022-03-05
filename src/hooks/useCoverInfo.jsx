import { useCovers } from "@/src/context/Covers";
import { defaultStats } from "@/src/helpers/cover";

export const useCoverInfo = (key) => {
  const { covers } = useCovers();

  const info = covers.find((x) => x.key === key) || { stats: defaultStats };

  return {
    coverInfo: { ...info },
  };
};
