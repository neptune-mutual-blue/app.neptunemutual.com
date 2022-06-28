import { useNetwork } from "@/src/context/Network";
import { useQuery } from "@/src/hooks/useQuery";
import { useEffect, useState } from "react";

const getQuery = (id) => {
  return `
  {
    coverPurchasedEvent (
      id: "${id}"
    ) {
      id
      amountToCover
      coverKey
      onBehalfOf
      cxToken
      expiresOn
      fee
      platformFee
      policyId
      productKey
      referralCode
      createdAtTimestamp
    }
  }
  
`;
};

export const useFetchCoverPurchasedEvent = ({ txHash }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const { networkId } = useNetwork();
  const { data: purchaseEventData, refetch } = useQuery();

  useEffect(() => {
    let ignore = false;

    function exec() {
      if (!purchaseEventData || !networkId) return;

      const _covers = purchaseEventData.coverPurchasedEvent || {};

      if (ignore) return;
      setData(_covers);
    }

    exec();

    return () => {
      ignore = true;
    };
  }, [purchaseEventData, networkId]);

  useEffect(() => {
    let ignore = false;

    setLoading(true);

    refetch(getQuery(txHash))
      .catch(console.error)
      .finally(() => {
        if (ignore) return;
        setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [refetch, txHash]);

  return {
    data,
    loading,
  };
};
