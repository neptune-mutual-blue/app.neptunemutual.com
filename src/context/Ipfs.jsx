import { utils } from "@neptunemutual/sdk";
import React, { useState } from "react";

const initValue = {
  data: [],
  getIpfsByHash: (_hash) => {},
};

const IpfsContext = React.createContext(initValue);

export function useIpfs() {
  const context = React.useContext(IpfsContext);
  if (context === undefined) {
    throw new Error("useIpfs must be used within a IpfsProvider");
  }
  return context;
}

export const IpfsProvider = ({ children }) => {
  const [data, setData] = useState({});

  const updateState = (hash, _data) => {
    setData((prev) => {
      return {
        ...prev,
        [hash]: _data,
      };
    });
  };

  const getIpfsByHash = (hash) => {
    updateState(hash, {}); // to avoid recursive calls
    utils.ipfs
      .read(hash)
      .then((ipfsData) => updateState(hash, ipfsData))
      .catch(() => updateState(hash, {})); // Provide fallback to stop infinite retries
  };

  return (
    <IpfsContext.Provider value={{ data, getIpfsByHash }}>
      {children}
    </IpfsContext.Provider>
  );
};
