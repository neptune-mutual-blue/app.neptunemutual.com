import { Container } from "@/common/Container/Container";
import LiquidityProductModal from "@/modules/my-liquidity/content/liquidity-product-modal";
import { Trans } from "@lingui/macro";
import { useState } from "react";

/**
 * @typedef IProductInfo
 * @prop {string} about
 * @prop {string} leverageName
 * @prop {Object.<string, string> | undefined} links
 * @prop {string} pricingCeiling
 * @prop {string} pricingFloor
 * @prop {string[] | undefined} resolutionSources
 * @prop {string} rules
 * @prop {string} tags
 * @prop {string} exclusions
 *
 * @typedef IProductBase
 * @prop {string} coverKey
 * @prop {string} productKey
 * @prop {string} ipsData
 * @prop {string} ipsHash
 * @prop {boolean} supportsProducts
 * @prop {IProductInfo & {
 *   productName: string
 * }} infoObj
 *
 * @typedef {IProductBase & {
 *   coverName: string
 *   products: IProductBase[]
 * }} ICoverProduct
 */

/**
 *
 * @param {{
 * coverInfo: ICoverProduct
 * }} param0
 * @returns
 */
export function CoveredProducts({ coverInfo }) {
  const [showModal, setShowModal] = useState(false);

  /**
   * @type {[IProductBase, (product: IProductBase) => void]}
   */
  const [productInfo, setProductInfo] = useState();

  return (
    <Container className="flex flex-col py-9">
      <div className="flex flex-col">
        <h4 className="mb-24 font-bold text-h3">
          <Trans>Products Covered Under This Pool</Trans>
        </h4>
        <div className="grid xl:grid-cols-6 md:grid-cols-4 xs:grid-cols-2 grid-cols-1">
          {coverInfo.products.map((product) => (
            <Product
              {...product}
              key={product.productKey}
              onClick={() => {
                setProductInfo(product);
                setShowModal(true);
              }}
            />
          ))}
        </div>
      </div>
      {showModal && (
        <LiquidityProductModal
          product={productInfo}
          setShowModal={setShowModal}
        />
      )}
    </Container>
  );
}

/**
 * @param {IProductBase & { onClick: () => void}} param0
 */
function Product({ infoObj: { productName }, onClick }) {
  return (
    <div className="flex flex-col items-center justify-start pb-8">
      <div className="flex items-center justify-center bg-white rounded-full max-h-[96px] max-w-[96px]">
        <img src="/images/covers/empty.svg" alt="base image" />
      </div>
      <h1 className="flex items-center pt-2 text-4e7dd9 font-sora">
        {productName}
        <button onClick={onClick}>
          <svg
            className="ml-2"
            width="15"
            height="14"
            viewBox="0 0 15 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.6892 2.80909L11.2199 8.23053L6.2673 3.27836L11.6892 2.80909Z"
              fill="#4E7DD9"
            />
            <path
              d="M3.30887 11.1899L3.77817 5.76849L8.73075 10.7207L3.30887 11.1899Z"
              fill="#4E7DD9"
            />
            <path
              d="M5.24805 9.16636L10.3445 4.07031"
              stroke="#4E7DD9"
              strokeWidth="1.33333"
            />
          </svg>
        </button>
      </h1>
    </div>
  );
}
