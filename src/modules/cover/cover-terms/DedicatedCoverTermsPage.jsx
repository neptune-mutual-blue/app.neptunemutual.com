import { Divider } from '@/common/Divider/Divider'
import { CoverTerms } from '@/modules/cover/cover-terms/CoverTerms'
import { StandardsTerms } from '@/modules/cover/cover-terms/StandardTerms'
import { Routes } from '@/src/config/routes'
import { t } from '@lingui/macro'
import Link from 'next/link'

export const DedicatedCoverTermsPage = ({ coverInfo }) => {
  if (!coverInfo) return <></>

  const effectiveDate = new Date().toISOString()

  return (
    <div className='pt-10 bg-white pl-52 pr-52 font-sora pb-14 text-000000'>
      <Link href={Routes.Home} replace>
        <a className='block w-max'>
          <picture>
            <img
              loading='lazy'
              alt={t`Neptune Mutual`}
              srcSet='/logos/neptune-mutual-full-beta.svg'
              className='w-full text-black h-9'
              data-testid='header-logo'
            />
          </picture>
        </a>
      </Link>

      <Divider className='border !border-black' />

      <p className='mt-3 text-lg font-semibold font-arial text-000000'>
        As of: {effectiveDate}
      </p>

      <CoverTerms coverInfo={coverInfo} />

      <StandardsTerms className='mt-12' />
    </div>
  )
}
