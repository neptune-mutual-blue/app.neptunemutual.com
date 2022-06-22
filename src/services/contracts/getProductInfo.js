import { SUBGRAPH_API_URLS } from "@/src/config/constants";
import { getNetworkId } from "@/src/config/environment";
import { SUBGRAPH_ERRORS } from "@/src/services/contracts/const";

/**
 * @typedef {import('@/src/services/contracts/const').IProduct} IProduct
 *
 * @param {string} key
 * @returns {string}
 */
const getQuery = (key) => `
{

  product (id: "${key}") {
    id
    coverKey
    productKey
    ipfsData
  }
}
`;

/**
 *
 * @param {string} cover_id
 * @param {string} product_id
 * @returns {Promise<IProduct>}
 */
export default function getProductInfo(cover_id, product_id) {
  const networkId = getNetworkId();

  if (!networkId || !cover_id || !product_id) {
    throw new Error(SUBGRAPH_ERRORS.REQUIRED_PARAM_ERROR);
  }

  const key = `${cover_id}-${product_id}`;

  const query = getQuery(key);

  const url = SUBGRAPH_API_URLS[networkId];

  if (!url) {
    throw new Error(SUBGRAPH_API_URLS.URL_NOT_FOUND);
  }

  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      query,
    }),
  })
    .then((res) => res.json())
    .then(({ data, errors }) => {
      if (errors) {
        throw new Error(SUBGRAPH_ERRORS.ERROR_404);
      }

      return {
        ...data.product,
        ipfsData: JSON.parse(data.product.ipfsData),
      };
    });
}
