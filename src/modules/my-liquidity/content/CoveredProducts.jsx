import { useState } from 'react'

import { Container } from '@/common/Container/Container'
import {
  LiquidityProductModal
} from '@/modules/my-liquidity/content/LiquidityProductModal'
import { getCoverImgSrc } from '@/src/helpers/cover'
import { Trans } from '@lingui/macro'

export function CoveredProducts ({ products }) {
  const [showModal, setShowModal] = useState(false)
  const [selectedProductData, setSelectedProductData] = useState()

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
          {products.map((productData) => {
            return (
              <Product
                productName={productData?.productInfoDetails?.productName}
                key={productData.productKey}
                productKey={productData.productKey}
                onClick={() => {
                  setSelectedProductData(productData)
                  setShowModal(true)
                }}
              />
            )
          })}
        </div>
      </div>
      {showModal && selectedProductData && (
        <LiquidityProductModal
          productData={selectedProductData}
          setShowModal={setShowModal}
        />
      )}
    </Container>
  )
}

function Product ({ productKey, productName, onClick }) {
  const imgSrc = getCoverImgSrc({ key: productKey })

  return (
    <div
      className='flex flex-col items-center justify-start pb-8'
      data-testid='cover-product'
    >
      <div className='flex items-center justify-center w-20 h-20 p-4 bg-white rounded-full'>
        <img src={imgSrc} alt={productName} className='w-12 h-12' />
      </div>
      <button
        className='flex items-center pt-2 tracking-wide uppercase text-4E7DD9'
        onClick={onClick}
      >
        {productName}
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
