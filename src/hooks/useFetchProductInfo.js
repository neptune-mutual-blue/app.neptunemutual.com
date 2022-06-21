import getProductInfo from "@/src/services/contracts/getProductInfo";
import { useEffect, useState } from "react";

/**
 * @typedef ICoverInfo
 * @prop {string} coverName
 * @prop {string} about
 * @prop {string} rules
 * @prop {string} coverKey
 * @prop {string[]} tags
 * @prop {string[]} resolutionSources
 * @prop {Object.<string, string>} links
 *
 * @typedef {import('@/src/services/contracts/const').IProduct} IProduct
 *
 * @param {string} coverKey
 * @param {string} productKey
 * @returns {ICoverInfo}
 */
export function useFetchProductInfo(coverKey, productKey) {
  /**
   * @type {[ICoverInfo, (product: ICoverInfo) => void]}
   */
  const [product, setProductInfo] = useState(null);

  useEffect(() => {
    if (coverKey && productKey) {
      getProductInfo(coverKey, productKey)
        .then((data) => {
          setProductInfo({
            coverName: data.ipfsData.productName,
            links: data.ipfsData.links,
            coverKey: productKey,
            about: data.ipfsData.about,
            rules: data.ipfsData.rules,
            tags: data.ipfsData.tags,
            resolutionSources: data.ipfsData.resolutionSources,
          });
        })
        .catch(() => {
          // error occured
        });
    }
  }, [coverKey, productKey]);

  return product;
}
