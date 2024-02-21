import { useEffect } from 'react'

import Link from 'next/link'

import { Divider } from '@/common/Divider/Divider'
import {
  Loading,
  NoDataFound
} from '@/common/Loading'
import { CoverTerms } from '@/modules/cover/cover-terms/CoverTerms'
import { StandardsTerms } from '@/modules/cover/cover-terms/StandardTerms'
import { Routes } from '@/src/config/routes'
import { isValidProduct } from '@/src/helpers/cover'

export const SingleCoverTermsPage = ({ loading, coverOrProductData }) => {
  useEffect(() => {
    if (!coverOrProductData) { return }

    setTimeout(() => {
      window.print()
      window.close()
    }, 500)
  }, [coverOrProductData])

  if (loading) {
    return (
      <Loading />
    )
  }

  if (!coverOrProductData) {
    return (
      <NoDataFound />
    )
  }

  const effectiveDate = new Date().toISOString()
  const isDiversifiedProduct = isValidProduct(coverOrProductData.productKey)

  const name = isDiversifiedProduct ? coverOrProductData?.productInfoDetails?.productName : coverOrProductData?.coverInfoDetails.coverName || coverOrProductData?.coverInfoDetails.projectName
  const blockchains = isDiversifiedProduct ? coverOrProductData?.productInfoDetails?.blockchains : coverOrProductData?.coverInfoDetails.blockchains
  const about = isDiversifiedProduct ? coverOrProductData?.productInfoDetails?.about : coverOrProductData?.coverInfoDetails.about
  const parameters = isDiversifiedProduct ? coverOrProductData?.productInfoDetails?.parameters : coverOrProductData?.coverInfoDetails.parameters

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

      <CoverTerms
        name={name}
        blockchains={blockchains}
        about={about}
        parameters={parameters}
      />

      <StandardsTerms className='mt-12' />
    </div>
  )
}
