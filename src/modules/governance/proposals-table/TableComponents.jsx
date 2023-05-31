import { InfoTooltip } from '@/common/Cover/InfoTooltip'
import { LastSynced } from '@/common/LastSynced'
import { Select } from '@/common/Select'
import ChevronDownIcon from '@/icons/ChevronDownIcon'
import DocumentationIcon2 from '@/icons/DocumentationIcon2'
import ExternalLinkIcon from '@/icons/ExternalLinkIcon'
import { PieChartIcon } from '@/icons/PieChartIcon'
import DateLib from '@/lib/date/DateLib'
import { Results } from '@/modules/governance/proposals-table/result-bars/Results'
import { NPM_SNAPSHOT_SPACE, SNAPSHOT_SITE_URL } from '@/src/config/constants'
import { Routes } from '@/src/config/routes'
import { useNetwork } from '@/src/context/Network'
import { useBlockHeight } from '@/src/hooks/useBlockHeight'
import { classNames } from '@/utils/classnames'
import { fromNow } from '@/utils/formatter/relative-time'
import { Trans } from '@lingui/macro'
import Link from 'next/link'

export const WhenRenderer = ({ row, locale }) => {
  return (
    <td
      className='px-6 py-4 text-sm w-42 whitespace-nowrap'
    >
      <InfoTooltip infoComponent={DateLib.toLongDateFormat(row.start / 1000, locale)}>
        <span>
          {fromNow(row.start)}
        </span>
      </InfoTooltip>
    </td>
  )
}

const StateTag = ({ tag }) => (
  <span
    className={
    classNames('py-0.5 px-1.5 text-xs rounded-2xl',
      tag === 'Live' ? 'text-white bg-D92D20' : 'text-344054 bg-F2F4F7'
    )
  }
  >
    {tag}
  </span>
)

export const TypeRenderer = ({ row }) => {
  return (
    <td
      className='w-24 px-6 py-4 text-xs whitespace-nowrap'
    >
      <StateTag tag={row.state} />
    </td>
  )
}

export const DetailsRenderer = ({ row }) => {
  return (
    <td
      className='px-6 py-4 text-sm min-w-345'
      data-testid='timestamp-col'
    >
      {row.title}
    </td>
  )
}

const CategoryTag = () => (
  <span
    className={
  classNames('py-0.5 px-1.5 text-xs rounded-2xl',
    'bg-[#ECFDF3] text-[#027A48]'
  )
}
  >
    GC Emission
  </span>
)

export const TagRenderer = () => {
  return (
    <td
      className='px-6 py-4 text-xs w-28 whitespace-nowrap'
    >
      <CategoryTag />
    </td>
  )
}

export const ResultRenderer = ({ row }) => {
  return (
    <td
      className='px-6 py-4 w-330px whitespace-nowrap'
    >
      <Results
        results={row.scores}
      />
    </td>
  )
}

export const ActionsRenderer = ({ row }) => {
  const setGaugeUrl = Routes.GovernanceProposalPage(row.id)
  const submitVoteUrl = `${SNAPSHOT_SITE_URL}/#/${NPM_SNAPSHOT_SPACE}/proposal/${row.id}`
  return (
    <td
      className='px-6 py-4 w-96 whitespace-nowrap'
    >
      <div className='text-sm text-right text-01052D'>
        {
          row.state === 'Live'
            ? (
              <>
                <Link href={setGaugeUrl}>
                  <a className='flex items-center justify-end gap-1'>
                    <Trans>Set Gauge</Trans>
                    <PieChartIcon />
                  </a>
                </Link>
                <a target='_blank' className='flex items-center justify-end gap-1 mt-2' href={submitVoteUrl} rel='noreferrer'>
                  <Trans>Submit Your Vote</Trans>
                  <ExternalLinkIcon />
                </a>
              </>
              )
            : (
              <a target='_blank' className='flex items-center justify-end gap-1' href={submitVoteUrl} rel='noreferrer'>
                <Trans>View Proposal</Trans>
                <DocumentationIcon2 />
              </a>
              )
        }
      </div>
    </td>
  )
}

export const TitleComponent = ({ filterOptions, filter, setFilter }) => {
  const { networkId } = useNetwork()
  const blockNumber = useBlockHeight()

  return (
    <div className='flex items-center justify-between px-6 py-5 bg-white border border-b-0 rounded-t-xl border-B0C4DB'>
      <LastSynced blockNumber={blockNumber} networkId={networkId} />

      <Select
        options={filterOptions}
        selected={filter}
        setSelected={setFilter}
        className='w-auto'
        direction='right'
        icon={<ChevronDownIcon className='w-6 h-6' aria-hidden='true' />}
      />
    </div>
  )
}
