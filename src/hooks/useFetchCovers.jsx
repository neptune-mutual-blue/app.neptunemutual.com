import { useState, useEffect } from "react";
import { getGraphURL } from "@/src/config/environment";
import { useAppContext } from "@/src/context/AppWrapper";
import { toUtf8String } from "@ethersproject/strings";

const defaultInfo = {
  coverFees: {
    min: 5,
    max: 7,
  },
  apr: 12.03,
  utilizationRatio: 25,
  protection: 800000,
  liquidity: 11010000,
};

export const useFetchCovers = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const { networkId } = useAppContext();

  useEffect(() => {
    if (!networkId) {
      return;
    }

    const graphURL = getGraphURL(networkId);

    if (!graphURL) {
      return;
    }

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
          covers (
            where: {
              id_not_in: [
                "0x70726f746f3a636f6e7472616374733a636f7665723a6366633a303100000000"
              ]
            }
          ) {
            id
            key
            ipfsHash
            ipfsBytes
          }
        }        
        `,
      }),
    })
      .then((r) => r.json())
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [networkId]);

  const covers = (data?.covers || []).map((x) => {
    let ipfsData = {};

    try {
      ipfsData = JSON.parse(toUtf8String(x.ipfsBytes));
    } catch (err) {
      console.error(err);
    }

    return {
      key: x.key,
      projectName: ipfsData.projectName,
      coverName: ipfsData.coverName,
      resolutionSources: ipfsData.resolutionSources,
      about: ipfsData.about,
      tags: ipfsData.tags,
      rules: ipfsData.rules,
      links: ipfsData.links,

      ...defaultInfo,
    };
  });

  return {
    data: {
      covers,
    },
    loading,
  };
};
