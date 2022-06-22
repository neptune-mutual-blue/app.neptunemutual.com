import { utils } from "@neptunemutual/sdk";
import { stringifyProps } from "../../../../utils/props";
import { getKeys, getMetadataKeys } from "./keys";

export const getInfo = async (chainId, coverKey, account, provider) => {
  try {
    const metadataKeys = getMetadataKeys(coverKey);
    const metadataResult = await utils.store.readStorage(
      chainId,
      metadataKeys,
      provider
    );

    const all = await getKeys(provider, coverKey, account, metadataResult);
    const result = await utils.store.readStorage(chainId, all, provider);

    return stringifyProps(result);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
