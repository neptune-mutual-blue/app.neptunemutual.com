import { getBasketProducts } from "@/src/services/contracts/getBasketProducts";
import { useEffect, useState } from "react";

/**
 * @typedef {import('@/src/services/contracts/const').IProduct} IProduct
 *
 * @param {string} coverKey
 * @returns {{
 *  products: IProduct[],
 *  loading: boolean
 * }}
 */
export function useFetchBasketProducts(coverKey) {
  /**
   * @type {[IProduct[], (products: IProduct[]) => void]}
   */
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (coverKey) {
      getBasketProducts(coverKey)
        .then((data) => {
          setProducts(data);
          setLoading(false);

          console.log(data);
        })
        .catch(() => {
          // error occured
        });
    }
  }, [coverKey]);

  return { products, loading };
}
