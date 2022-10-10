import { getCoverImgSrc } from '@/src/helpers/cover'
import React from 'react'
import { classNames } from '@/utils/classnames'
import { Trans } from '@lingui/macro'

export const CoverAvatar = ({
  coverInfo,
  isDiversified,
  containerClass = 'grow',
  small = false
}) => {
  if (!coverInfo) {
    return null
  }

  const { coverKey, productKey, products } = coverInfo
  const isCover = Array.isArray(coverInfo.products)

  return (
    <div className={classNames('flex items-center', containerClass)}>
      {isDiversified && isCover
        ? (
          <>
            {products.slice(0, 3).map((item, idx) => {
              const imgSrc = getCoverImgSrc({ key: item.productKey })
              return (
                <div
                  className={classNames(
                    'inline-block max-w-full bg-FEFEFF rounded-full w-14 h-14',
                    idx !== 0 && '-ml-7 lg:-ml-9 p-0.5',
                    small ? 'lg:-ml-6' : 'lg:w-18 lg:h-18'
                  )}
                  key={item.id}
                >
                  <img
                    src={imgSrc}
                    alt={item.infoObj.productName}
                    className='w-full h-full p-2 rounded-full bg-DEEAF6'
                    data-testid='cover-img'
                    onError={(ev) => (ev.target.src = '/images/covers/empty.svg')}
                  />
                </div>
              )
            })}

            {products.length > 3 && (
              <p className='ml-2 text-xs opacity-40 text-01052D'>
                +{products.length - 3} <Trans>MORE</Trans>
              </p>
            )}
          </>
          )
        : (
          <div
            className={classNames(
              'inline-flex justify-center items-center max-w-full bg-DEEAF6 p-4 rounded-full w-14 h-14',
              small ? '' : 'lg:w-18 lg:h-18'
            )}
          >
            <img
              src={getCoverImgSrc({ key: isDiversified ? productKey : coverKey })}
              alt={
              isDiversified
                ? coverInfo.infoObj.productName
                : coverInfo.infoObj.coverName
            }
              className='inline-block'
              data-testid='cover-img'
              onError={(ev) => (ev.target.src = '/images/covers/empty.svg')}
            />
          </div>
          )}
    </div>
  )
}
