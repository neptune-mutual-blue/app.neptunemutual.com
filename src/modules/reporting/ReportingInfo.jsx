import { utils } from "@neptunemutual/sdk";
import { useEffect, useState } from "react";
import { Trans } from "@lingui/macro";

export const ReportingInfo = ({ ipfsBytes }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    let ignore = false;
    utils.ipfs
      .readBytes32(ipfsBytes)
      .then((x) => {
        if (ignore) return;
        setData(x);
      })
      .catch(console.error);

    return () => {
      ignore = true;
    };
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
