import { utils } from "@neptunemutual/sdk";
import { useEffect, useState } from "react";
import { Trans } from "@lingui/macro";

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
      <summary>
        <Trans>Reporting Info</Trans>
      </summary>
      <pre className="p-4 overflow-x-auto bg-white rounded-md">
        {JSON.stringify(data, null, 2)}
      </pre>
    </details>
  );
};
