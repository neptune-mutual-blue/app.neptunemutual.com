import { explainInterval } from '@/utils/formatter/interval'
import Link from 'next/link'
import { Trans } from '@lingui/macro'
import { useCoverStatsContext } from '@/common/Cover/CoverStatsContext'
import { SecondaryCard } from '@/common/SecondaryCard/SecondaryCard'

export const CoverResolutionSources = ({ children, coverInfo }) => {
  const { reportingPeriod } = useCoverStatsContext()
  const resolutionSources = coverInfo?.infoObj.resolutionSources || []

  return (
    <div className='col-span-3 row-start-2 lg:col-auto lg:row-start-auto'>
      <SecondaryCard>
        <div className='flex flex-wrap justify-between md:block'>
          <div>
            <h3 className='font-semibold text-h4 font-sora'>
              <Trans>Resolution Sources</Trans>
            </h3>
            <p className='mt-1 mb-6 text-sm opacity-50'>
              {explainInterval(reportingPeriod)} <Trans>Reporting Period</Trans>
            </p>
          </div>
          <div className='flex flex-col md:block sm:items-end'>
            {resolutionSources.map(source => {
              return (
                <Link key={source.uri} href={source.uri}>
                  <a
                    target='_blank'
                    className='block mt-3 capitalize text-4e7dd9 hover:underline sm:mt-0 md:mt-3'
                    rel='nofollow'
                  >
                    {source.text}
                  </a>
                </Link>
              )
            })}
          </div>
        </div>

        {children}
      </SecondaryCard>
    </div>
  )
}
