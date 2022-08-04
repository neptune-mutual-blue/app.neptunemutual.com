import DateLib from "@/lib/date/DateLib";
import { useNetwork } from "@/src/context/Network";
import { fetchSubgraph } from "@/src/services/fetchSubgraph";
import { useEffect, useState } from "react";

export const storePurchaseEvent = (event, from) => {
  const txHash = event.transactionHash;

  const {
    coverKey,
    productKey,
    onBehalfOf,
    cxToken,
    fee,
    platformFee,
    amountToCover,
    expiresOn,
    referralCode,
    policyId,
  } = event.args;

  const value = {
    event: {
      id: txHash,
      coverKey: coverKey.toString(),
      productKey: productKey.toString(),
      onBehalfOf: onBehalfOf.toString(),
      cxToken: cxToken.toString(),
      fee: fee.toString(),
      platformFee: platformFee.toString(),
      amountToCover: amountToCover.toString(),
      expiresOn: expiresOn.toString(),
      referralCode: referralCode.toString(),
      policyId: policyId.toString(),
      createdAtTimestamp: DateLib.unix(),

      transaction: {
        from,
      },
    },
    expiry: DateLib.toUnix(DateLib.addMinutes(new Date(), 5)),
  };

  localStorage.setItem(txHash, JSON.stringify(value));
  return txHash;
};

const getQuery = (id) => {
  return `
  {
    coverPurchasedEvent (
      id: "${id}"
    ) {
      id
      coverKey
      productKey
      onBehalfOf
      cxToken
      fee
      platformFee
      amountToCover
      expiresOn
      referralCode
      policyId
      createdAtTimestamp

      transaction {
        from
      }
    }
  }
`;
};

const getEventFromSubgraph = async (networkId, txHash) => {
  const data = await fetchSubgraph("useCoverPurchasedEvent")(
    networkId,
    getQuery(txHash)
  );
  return data.coverPurchasedEvent;
};

const getEventFromStorage = async (txHash) => {
  try {
    const str = localStorage.getItem(txHash);
    const data = JSON.parse(str);

    if (data.expiry < DateLib.unix()) {
      localStorage.removeItem(txHash);
    }

    return data.event;
  } catch (error) {}

  return null;
};

const getEvent = async (networkId, txHash) => {
  return getEventFromStorage(txHash).then((data) => {
    if (!data) {
      return getEventFromSubgraph(networkId, txHash);
    }

    return data;
  });
};

export const useFetchCoverPurchasedEvent = ({ txHash }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { networkId } = useNetwork();

  useEffect(() => {
    let ignore = false;

    setLoading(true);
    getEvent(networkId, txHash)
      .then((data) => {
        if (!data || ignore) return;
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });

    return () => {
      ignore = true;
    };
  }, [networkId, txHash]);

  return {
    data,
    loading,
  };
};
