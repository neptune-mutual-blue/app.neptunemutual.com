import { useEffect } from 'react'

import Link from 'next/link'

import { Divider } from '@/common/Divider/Divider'
import { CoverTerms } from '@/modules/cover/cover-terms/CoverTerms'
import { StandardsTerms } from '@/modules/cover/cover-terms/StandardTerms'
import { Routes } from '@/src/config/routes'
import { isValidProduct } from '@/src/helpers/cover'
import {
  t,
  Trans
} from '@lingui/macro'
import { useLingui } from '@lingui/react'

export const SingleCoverTermsPage = ({ loading, coverOrProductData }) => {
  useEffect(() => {
    if (!coverOrProductData) { return }

    setTimeout(() => {
      window.print()
      window.close()
    }, 500)
  }, [coverOrProductData])

  const { i18n } = useLingui()

  if (loading) {
    return (
      <p className='text-center'>
        <Trans>loading...</Trans>
      </p>
    )
  }

  if (!coverOrProductData) {
    return (
      <p className='text-center'>
        <Trans>No Data Found</Trans>
      </p>
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
            alt={t(i18n)`Neptune Mutual`}
            srcSet='/logos/neptune-mutual-full-beta.svg'
            className='w-full text-black h-9'
            data-testid='header-logo'
          />
        </picture>

      </Link>

      <Divider className='border !border-black' />

      <p className='mt-3 text-lg font-semibold font-arial text-000000'>
        <Trans>As of: {effectiveDate}</Trans>
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
