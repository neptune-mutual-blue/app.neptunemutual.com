import { useState, useEffect } from "react";
import { getGraphURL } from "@/src/config/environment";
import { useAppContext } from "@/src/context/AppWrapper";
import { toUtf8String } from "@ethersproject/strings";
import { utils } from "@neptunemutual/sdk";

const setIpfsData = (setter, id, ipfsData) => {
  setter((prevData) => {
    const prevCovers = prevData?.covers || [];

    const nextCovers = prevCovers.map((x) => {
      if (x.id === id) {
        return {
          ...x,
          ipfsData,
        };
      }

      return x;
    });

    return {
      covers: nextCovers,
    };
  });
};

export const useFetchCovers = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const { networkId } = useAppContext();

  useEffect(() => {
    if (!data || !data.covers || !Array.isArray(data.covers)) {
      return;
    }

    const _covers = data.covers;
    for (let i = 0; i < _covers.length; i++) {
      const _cover = _covers[i];
      const _id = _cover.id;

      if (_cover.ipfsHash && !_cover.ipfsBytes && !_cover.ipfsData) {
        utils.ipfs
          .read(_cover.ipfsHash)
          .then((ipfsData) => setIpfsData(setData, _id, ipfsData))
          .catch(setIpfsData(setData, _id, {}));
      }
    }
  }, [data]);

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
          covers {
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
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [networkId]);

  const covers = (data?.covers || []).map((x) => {
    let ipfsData = x.ipfsData || {};

    try {
      ipfsData = JSON.parse(toUtf8String(x.ipfsBytes));
    } catch (err) {
      console.log("Could not parse ipfs bytes", x.key);
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

      ipfsData: ipfsData,
    };
  });

  return {
    data: {
      covers,
    },
    loading,
  };
};
