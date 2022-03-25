import { getKeys } from "./keys";
import { utils } from "@neptunemutual/sdk";
import { stringifyProps } from "../../../../utils/props";

export const getInfo = async (chainId, coverKey, account, provider) => {
  try {
    const candidates = await getKeys(chainId, provider, coverKey, account);
    const result = await utils.store.readStorage(chainId, candidates, provider);

    return stringifyProps(result);
  } catch (error) {
    console.error(error);
  }
};
