import { Container } from '@/common/Container/Container'
import { LiquidityProductModal } from '@/modules/my-liquidity/content/LiquidityProductModal'
import { getCoverImgSrc } from '@/src/helpers/cover'
import { Trans } from '@lingui/macro'
import { useState } from 'react'

/**
 * @typedef IProductInfo
 * @prop {string} about
 * @prop {string} leverageName
 * @prop {Object.<string, string> | undefined} links
 * @prop {string} pricingCeiling
 * @prop {string} pricingFloor
 * @prop {string[] | undefined} resolutionSources
 * @prop {string} rules
 * @prop {Array} parameters
 * @prop {string} tags
 * @prop {string} exclusions
 * @prop {string} capitalEfficiency
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
export function CoveredProducts ({ coverInfo }) {
  const [showModal, setShowModal] = useState(false)

  /**
   * @type {[IProductBase, (product: IProductBase) => void]}
   */
  const [productInfo, setProductInfo] = useState()

  return (
    <Container
      className='flex flex-col py-9'
      data-testid='cover-products-container'
    >
      <div className='flex flex-col'>
        <h4 className='mb-24 font-bold text-display-xs'>
          <Trans>Products Covered Under This Pool</Trans>
        </h4>
        <div className='grid grid-cols-1 xl:grid-cols-6 md:grid-cols-4 xs:grid-cols-2'>
          {coverInfo.products.map((product) => (
            <Product
              {...product}
              key={product.productKey}
              onClick={() => {
                setProductInfo(product)
                setShowModal(true)
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
  )
}

/**
 * @param {IProductBase & { onClick: () => void}} param0
 */
function Product ({ productKey, infoObj, onClick }) {
  const imgSrc = getCoverImgSrc({ key: productKey })
  return (
    <div
      className='flex flex-col items-center justify-start pb-8'
      data-testid='cover-product'
    >
      <div className='flex items-center justify-center w-20 h-20 p-4 bg-white rounded-full'>
        <img src={imgSrc} alt={infoObj.productName} className='w-12 h-12' />
      </div>
      <button
        className='flex items-center pt-2 tracking-wide uppercase text-4e7dd9'
        onClick={onClick}
      >
        {infoObj.productName}
        <div>
          <svg
            className='ml-2'
            width='15'
            height='14'
            viewBox='0 0 15 14'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M11.6892 2.80909L11.2199 8.23053L6.2673 3.27836L11.6892 2.80909Z'
              fill='#4E7DD9'
            />
            <path
              d='M3.30887 11.1899L3.77817 5.76849L8.73075 10.7207L3.30887 11.1899Z'
              fill='#4E7DD9'
            />
            <path
              d='M5.24805 9.16636L10.3445 4.07031'
              stroke='#4E7DD9'
              strokeWidth='1.33333'
            />
          </svg>
        </div>
      </button>
    </div>
  )
}
