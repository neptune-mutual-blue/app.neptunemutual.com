import { utils } from "@neptunemutual/sdk";

export const getStoredData = async (candidates, chainId, provider) => {
  const result = await utils.store.readStorage(chainId, candidates, provider);

  return result;
};
