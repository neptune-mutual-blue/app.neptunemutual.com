import { useEffect } from 'react'

import Link from 'next/link'

import { Divider } from '@/common/Divider/Divider'
import {
  Loading,
  NoDataFound
} from '@/common/Loading'
import { CoverTerms } from '@/modules/cover/cover-terms/CoverTerms'
import { Network } from '@/modules/cover/cover-terms/Network'
import { StandardsTerms } from '@/modules/cover/cover-terms/StandardTerms'
import { Routes } from '@/src/config/routes'

export const DiversifiedCoverTermsPage = ({ loading, coverData, subProducts }) => {
  useEffect(() => {
    if (!coverData) { return }

    setTimeout(() => {
      window.print()
      window.close()
    }, 500)
  }, [coverData])

  if (loading) {
    return (
      <Loading />
    )
  }

  if (!coverData) {
    return (
      <NoDataFound />
    )
  }

  const name = coverData?.coverInfoDetails.coverName || coverData?.coverInfoDetails.projectName
  const blockchains = coverData?.coverInfoDetails.blockchains
  const about = coverData?.coverInfoDetails.about

  const effectiveDate = new Date().toISOString()

  return (
    <div>
      <Link href={Routes.Home} replace className='block w-max'>

        <picture>
          <img
            loading='lazy'
            alt='Neptune Mutual'
            srcSet='/logos/neptune-mutual-full-beta.svg'
            className='w-full text-black h-9'
            data-testid='header-logo'
          />
        </picture>

      </Link>

      <Divider className='border !border-black' />

      <p className='mt-3 text-lg font-semibold font-arial text-000000'>
        As of: {effectiveDate}
      </p>

      <h1 className='mt-12 text-000000 text-display-md'>{name}</h1>

      {
        blockchains?.length && (
          <div className='mt-5'>
            <p className='font-semibold'>
              Covered Blockchains
            </p>
            <div className='flex flex-wrap gap-2 mt-2'>
              {
                blockchains.map((chain, idx) => {
                  return (
                    <Network
                      chainId={chain.chainId}
                      key={idx}
                    />
                  )
                })
              }
            </div>
          </div>
        )
      }

      <div className='mt-6'>
        <p>{about}</p>
      </div>

      <div>
        {
          subProducts?.length > 0 && subProducts.map((productData, i) => {
            return (
              <CoverTerms
                key={i}
                name={productData?.productInfoDetails?.productName}
                blockchains={productData?.productInfoDetails?.blockchains}
                about={productData?.productInfoDetails?.about}
                parameters={productData?.productInfoDetails?.parameters}
              />
            )
          })
        }
      </div>

      <StandardsTerms className='mt-12' />
    </div>
  )
}
