import { Divider } from '@/common/Divider/Divider'
import { CoverTerms } from '@/modules/cover/cover-terms/CoverTerms'
import { Network } from '@/modules/cover/cover-terms/Network'
import { StandardsTerms } from '@/modules/cover/cover-terms/StandardTerms'
import { Routes } from '@/src/config/routes'
import { t, Trans } from '@lingui/macro'
import Link from 'next/link'
import { useEffect } from 'react'

export const DiversifiedCoverTermsPage = ({ coverInfo }) => {
  useEffect(() => {
    if (!coverInfo) return

    setTimeout(() => {
      window.print()
      window.close()
    }, 500)
  }, [coverInfo])

  if (!coverInfo) return null

  const { infoObj: { coverName, about, blockchains }, products } = coverInfo

  const effectiveDate = new Date().toISOString()

  return (
    <div>
      <Link href={Routes.Home} replace className='block w-max'>

        <picture>
          <img
            loading='lazy'
            alt={t`Neptune Mutual`}
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

      <h1 className='mt-12 text-000000 text-h1'>{coverName}</h1>

      {
        blockchains?.length && (
          <div className='mt-5'>
            <p className='font-semibold'><Trans>Covered Blockchains</Trans></p>
            <div className='flex flex-wrap gap-2 mt-2'>
              {
                blockchains.map((chain, idx) => <Network chainId={chain.chainId} key={idx} />)
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
        products?.length && products.map((p, i) => <CoverTerms key={i} coverInfo={p} />)
      }

      </div>

      <StandardsTerms className='mt-12' />
    </div>
  )
}
