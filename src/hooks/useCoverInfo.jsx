import { useCovers } from "@/src/context/Covers";

export const useCoverInfo = (key) => {
  const { covers } = useCovers();

  const info = covers.find((x) => x.key === key) || {};

  return {
    coverInfo: { ...info },
  };
};
