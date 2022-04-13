import { utils } from "@neptunemutual/sdk";
import { useEffect, useState } from "react";

export const ReportingInfo = ({ ipfsBytes }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    utils.ipfs
      .readBytes32(ipfsBytes)
      .then((x) => setData(x))
      .catch(console.error);
  }, [ipfsBytes]);

  return (
    <details open>
      <summary>Reporting Info</summary>
      <pre className="p-4 bg-white rounded-md overflow-x-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </details>
  );
};
