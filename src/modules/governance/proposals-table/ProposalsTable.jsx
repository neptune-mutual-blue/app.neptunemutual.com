import { useState } from 'react'

import { useRouter } from 'next/router'

import { renderHeader } from '@/common/Table/renderHeader'
import {
  Table,
  TableShowMore,
  TableWrapper,
  TBody,
  THead
} from '@/common/Table/Table'
import {
  ActionsRenderer,
  DetailsRenderer,
  ResultRenderer,
  TableRowsSkeleton,
  TagRenderer,
  TitleComponent,
  TypeRenderer,
  WhenRenderer
} from '@/modules/governance/proposals-table/TableComponents'
import { useNetwork } from '@/src/context/Network'
import { useSnapshotProposals } from '@/src/hooks/useSnapshotProposals'
import { classNames } from '@/utils/classnames'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'

export const getColumns = (i18n) => {
  return [
    {
      id: 'when',
      name: t(i18n)`when`,
      align: 'left',
      renderHeader,
      renderData: (row, { locale }) => { return <WhenRenderer row={row} locale={locale} /> }
    },
    {
      id: 'type',
      name: '',
      align: 'center',
      renderHeader,
      renderData: (row) => { return <TypeRenderer row={row} /> }
    },
    {
      id: 'details',
      name: t(i18n)`details`,
      align: 'left',
      renderHeader,
      renderData: (row) => { return <DetailsRenderer row={row} /> }
    },
    {
      id: 'tags',
      name: '',
      align: 'center',
      renderHeader,
      renderData: (row) => { return <TagRenderer row={row} /> }
    },
    {
      id: 'result',
      name: t(i18n)`Result`,
      align: 'right',
      renderHeader,
      renderData: (row) => { return <ResultRenderer row={row} /> }
    },
    {
      id: 'actions',
      name: t(i18n)`Actions`,
      align: 'right',
      renderHeader,
      renderData: (row, { networkId }) => { return <ActionsRenderer row={row} networkId={networkId} /> }
    }
  ]
}

const getFilterOptions = (i18n) => {
  return [
    { name: t(i18n)`All`, value: 'all' },
    { name: t(i18n)`Gauge Controller Emission (GCE)`, value: '[gce' },
    { name: t(i18n)`Neptune Improvement Proposal (NIP)`, value: '[nip' },
    { name: t(i18n)`Gauge Controller Listing (GCL)`, value: '[gcl' },
    { name: t(i18n)`Liquidity Rewards (LR)`, value: '[lr' },
    { name: t(i18n)`Grants`, value: '[grant' }
  ]
}

const rowsPerPageOptions = [5, 10, 15, 30, 50, 100]

export const DEFAULT_ROWS_PER_PAGE = rowsPerPageOptions[4]

const getFilterString = item => {
  return item.value !== 'all' ? item.value : ''
}

export const ProposalsTable = () => {
  const { locale } = useRouter()
  const { networkId } = useNetwork()

  const { i18n } = useLingui()

  const filterOptions = getFilterOptions(i18n)

  const [filter, setFilter] = useState(filterOptions[0])

  const [page, setPage] = useState(1)
  const [rowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE)
  const { data, fetchProposals, loading, lastFetchedLength } = useSnapshotProposals()

  const showMore = (lastFetchedLength >= rowsPerPage)

  return (
    <div className='mt-8'>
      <TitleComponent
        filter={filter}
        filterOptions={filterOptions}
        setFilter={(val) => {
          if (val.value === filter.value) { return }
          fetchProposals({ page: 1, rowsPerPage, titleFilter: getFilterString(val) })
          setFilter(val)
          setPage(1)
        }}
      />
      <TableWrapper
        className={classNames('mt-0', showMore ? 'rounded-none' : 'rounded-t-none')}
      >
        <Table>
          <THead theadClass='rounded-t-none bg-F9FAFA' columns={getColumns(i18n)} />
          {
            !loading
              ? (
                <TBody
                  columns={getColumns(i18n)}
                  data={data}
                  extraData={{ locale, networkId }}
                />
                )
              : (
                <TableRowsSkeleton rowCount={rowsPerPage * page} />
                )
          }
        </Table>
      </TableWrapper>

      <TableShowMore
        show={showMore}
        loading={loading}
        onShowMore={() => {
          fetchProposals({
            page: page + 1,
            rowsPerPage,
            titleFilter: getFilterString(filter)
          })
          setPage(_page => { return _page + 1 })
        }}
      />
    </div>
  )
}
