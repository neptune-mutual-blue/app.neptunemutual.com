import { SUBGRAPH_API_URLS } from "@/src/config/constants";
import { getNetworkId } from "@/src/config/environment";
import { SUBGRAPH_ERRORS } from "@/src/services/contracts/const";

/**
 * @typedef {import('@/src/services/contracts/const').IProduct} IProduct
 *
 * @param {string} cover_id
 * @returns {string}
 */
const getQuery = (cover_id) => `
{
  products ( where: {
    coverKey: "${cover_id}"
  }) {
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
 * @returns {Promise<IProduct[]>}
 */
export function getBasketProducts(cover_id) {
  const networkId = getNetworkId();

  if (!networkId || !cover_id) {
    throw new Error(SUBGRAPH_ERRORS.REQUIRED_PARAM_ERROR);
  }

  const query = getQuery(cover_id);

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

      return data.products.map((product) => {
        product.ipfsData = JSON.parse(product.ipfsData);
        return product;
      });
    });
}
