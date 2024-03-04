import Link from 'next/link'

import { InfoTooltip } from '@/common/Cover/InfoTooltip'
import { LastSynced } from '@/common/LastSynced'
import { Select } from '@/common/Select'
import { Skeleton } from '@/common/Skeleton/Skeleton'
import ChevronDownIcon from '@/icons/ChevronDownIcon'
import ChevronLeftLgIcon from '@/icons/ChevronLeftLgIcon'
import DocumentationIcon2 from '@/icons/DocumentationIcon2'
import ExternalLinkIcon from '@/icons/ExternalLinkIcon'
import { PieChartIcon } from '@/icons/PieChartIcon'
import DateLib from '@/lib/date/DateLib'
import {
  Results
} from '@/modules/governance/proposals-table/result-bars/Results'
import { Routes } from '@/src/config/routes'
import { useNetwork } from '@/src/context/Network'
import { useBlockHeight } from '@/src/hooks/useBlockHeight'
import { classNames } from '@/utils/classnames'
import { fromNow } from '@/utils/formatter/relative-time'
import {
  getProposalLink,
  snapshotColors
} from '@/utils/snapshot'
import { Trans } from '@lingui/macro'

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

const StateTag = ({ tag }) => {
  return (
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
}

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

const CategoryTag = ({ value, type }) => {
  return (
    <span
      className='py-0.5 px-1.5 text-xs rounded-2xl'
      style={{
        background: snapshotColors[type].bg,
        color: snapshotColors[type].text
      }}
    >
      {value}
    </span>
  )
}

export const TagRenderer = ({ row }) => {
  return (
    <td
      className='px-6 py-4 text-xs w-28 whitespace-nowrap'
    >
      {
        row.category
          ? (
            <CategoryTag value={row.category.value} type={row.category.type} />
            )
          : <></>
      }
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

export const ActionsRenderer = ({ row, networkId }) => {
  const setGaugeUrl = Routes.GovernanceProposalPage(row.id, networkId)
  const proposalLink = getProposalLink(networkId, row.id)

  return (
    <td
      className='px-6 py-4 w-96 whitespace-nowrap'
    >
      <div className='text-sm text-right text-01052D'>
        {
          row.tag === 'gce' && (
            (
              <Link href={setGaugeUrl} className='flex items-center justify-end gap-1'>

                <Trans>Set Gauge</Trans>
                <PieChartIcon />

              </Link>
            )
          )
        }
        {
          row.state === 'Live'
            ? (
              <a target='_blank' className='flex items-center justify-end gap-1 mt-2' href={proposalLink} rel='noreferrer'>
                <Trans>Submit Your Vote</Trans>
                <ExternalLinkIcon />
              </a>
              )
            : (
              <a target='_blank' className='flex items-center justify-end gap-1' href={proposalLink} rel='noreferrer'>
                <Trans>View Proposal</Trans>
                <DocumentationIcon2 />
              </a>
              )
        }
      </div>
    </td>
  )
}

export const TablePagination = ({
  options,
  setRowsPerPage = (val) => { return val },
  onPrev = () => {},
  onNext = () => {},
  hasPrev = true,
  hasNext = true,
  currentPage = 1,
  rowsPerPage = 10,
  currentItems = 10,
  totalItems = 10,
  loading = false,
  defaultRowsPerPage = 50
}) => {
  const from = ((currentPage - 1) * rowsPerPage) + 1
  const to = ((currentPage - 1) * rowsPerPage) + currentItems

  return (
    <div className='border border-t-0 border-B0C4DB rounded-b-xl bg-white px-6 pt-3 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-end gap-2.5'>
      <div className='flex items-center gap-4 text-sm'>
        <label className='opacity-40' htmlFor='rows-per-page'>Rows per page</label>

        <select
          className='px-2 py-1 border cursor-pointer border-B0C4DB rounded-1 disabled:cursor-not-allowed'
          name='rows-per-page'
          id='rows-per-page'
          onChange={e => { return setRowsPerPage(Number(e.target.value)) }}
          disabled={loading}
          defaultValue={defaultRowsPerPage}
        >
          {options.map(_page => { return <option key={_page} value={_page}>{_page}</option> })}
        </select>

        <span className='opacity-40'>
          {from}-{to} of {totalItems}
        </span>
      </div>

      <div className='flex items-center justify-between w-full gap-2 sm:justify-center sm:w-auto'>
        <button
          className='disabled:opacity-20 disabled:cursor-not-allowed'
          disabled={!hasPrev || loading}
          onClick={() => { return onPrev() }}
        >
          <ChevronLeftLgIcon className='w-6 h-6' />
        </button>

        <button
          className='disabled:opacity-20 disabled:cursor-not-allowed'
          disabled={!hasNext || loading}
          onClick={() => { return onNext() }}
        >
          <ChevronLeftLgIcon className='w-6 h-6 transform rotate-180' />
        </button>
      </div>
    </div>
  )
}

export const TitleComponent = ({ filterOptions, filter, setFilter }) => {
  const { networkId } = useNetwork()
  const blockNumber = useBlockHeight()

  return (
    <div className='flex flex-col items-start justify-between gap-2 px-6 py-5 bg-white border border-b-0 sm:items-center sm:flex-row rounded-t-xl border-B0C4DB'>
      <LastSynced blockNumber={blockNumber} networkId={networkId} />

      <Select
        options={filterOptions}
        selected={filter}
        setSelected={setFilter}
        className='w-full sm:w-auto'
        direction='right'
        icon={<ChevronDownIcon className='w-6 h-6' aria-hidden='true' />}
      />
    </div>
  )
}

export const TableRowsSkeleton = ({ rowCount = 10 }) => {
  const Row = () => {
    return (
      <tr>
        <td className='px-6 py-4 w-60'>
          <Skeleton className='h-4 w-18' />
        </td>
        <td className='px-6 py-4 w-60'>
          <Skeleton className='h-4.5 w-9 rounded-2xl' />
        </td>
        <td className='px-6 py-4 space-y-1 min-w-345'>
          <Skeleton className='w-full h-4' />
          <Skeleton className='w-full h-4' />
        </td>
        <td className='px-6 py-4'>
          <Skeleton className='h-4.5 w-20 rounded-2xl' />
        </td>
        <td className='px-6 py-4 space-y-2'>
          <Skeleton className='h-4.5 w-72 rounded-2xl' />
          <Skeleton className='h-4.5 w-72 rounded-2xl' />
          <Skeleton className='h-4.5 w-72 rounded-2xl' />
        </td>
        <td className='px-6 py-4'>
          <div className='flex items-center justify-end gap-1'>
            <Skeleton className='h-4 w-18' />
            <Skeleton className='w-4 h-4 rounded-2xl' />
          </div>
        </td>
      </tr>
    )
  }

  return (
    <tbody className='border-t divide-y divide-DAE2EB border-DAE2EB'>
      {
        Array(rowCount).fill(0).map((_a, i) => {
          return (
            <Row key={i} />
          )
        })
      }
    </tbody>
  )
}
