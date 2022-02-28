import { useState, useEffect } from "react";
import { getGraphURL } from "@/src/config/environment";
import { useAppContext } from "@/src/context/AppWrapper";
import { sumOf } from "@/utils/bn";
import DateLib from "@/lib/date/DateLib";

const defaultData = "0";

export const useFetchCoverProtection = ({ coverKey }) => {
  const [data, setData] = useState(defaultData);
  const [loading, setLoading] = useState(false);
  const { networkId } = useAppContext();

  useEffect(() => {
    if (!networkId || !coverKey) {
      return;
    }

    const graphURL = getGraphURL(networkId);

    if (!graphURL) {
      return;
    }

    const now = DateLib.unix();

    setLoading(true);
    fetch(graphURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        query: `
        {
          cxTokens(where: {
            expiryDate_gt: "${now}"
            key: "${coverKey}"
          }){
            key
            totalCoveredAmount
          }
        }
        `,
      }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (!res.errors) {
          setData(
            sumOf(
              ...res.data.cxTokens.map((x) => x.totalCoveredAmount)
            ).toString()
          );
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [coverKey, networkId]);

  return {
    data,
    loading,
  };
};
