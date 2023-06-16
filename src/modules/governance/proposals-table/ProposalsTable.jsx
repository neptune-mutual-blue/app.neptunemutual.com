import { TBody, THead, Table, TableWrapper } from '@/common/Table/Table'
import { renderHeader } from '@/common/Table/renderHeader'
import { ActionsRenderer, DetailsRenderer, ResultRenderer, TableRowsSkeleton, TableShowMore, TagRenderer, TitleComponent, TypeRenderer, WhenRenderer } from '@/modules/governance/proposals-table/TableComponents'
import { useNetwork } from '@/src/context/Network'
import { useSnapshotProposals } from '@/src/hooks/useSnapshotProposals'
import { classNames } from '@/utils/classnames'
import { t } from '@lingui/macro'
import { useRouter } from 'next/router'
import { useState } from 'react'

export const getColumns = () => {
  return [
    {
      name: t`when`,
      align: 'left',
      renderHeader,
      renderData: (row, { locale }) => { return <WhenRenderer row={row} locale={locale} /> }
    },
    {
      name: t``,
      align: 'center',
      renderHeader,
      renderData: (row) => { return <TypeRenderer row={row} /> }
    },
    {
      name: t`details`,
      align: 'left',
      renderHeader,
      renderData: (row) => { return <DetailsRenderer row={row} /> }
    },
    {
      name: t``,
      align: 'center',
      renderHeader,
      renderData: (row) => { return <TagRenderer row={row} /> }
    },
    {
      name: 'Result',
      align: 'right',
      renderHeader,
      renderData: (row) => { return <ResultRenderer row={row} /> }
    },
    {
      name: 'Actions',
      align: 'right',
      renderHeader,
      renderData: (row, { networkId }) => { return <ActionsRenderer row={row} networkId={networkId} /> }
    }
  ]
}

const filterOptions = [
  { name: t`All`, value: 'all' },
  { name: t`Gauge Controller Emission (GCE)`, value: '[gce' },
  { name: t`Neptune Improvement Proposal (NIP)`, value: '[nip' },
  { name: t`Gauge Controller Listing (GCL)`, value: '[gcl' },
  { name: t`Liquidity Rewards (LR)`, value: '[lr' },
  { name: t`Grants`, value: '[grant' }
]

const rowsPerPageOptions = [5, 10, 15, 30, 50, 100]

export const DEFAULT_ROWS_PER_PAGE = rowsPerPageOptions[4]

const getFilterString = item => {
  return item.value !== 'all' ? item.value : ''
}

export const ProposalsTable = () => {
  const { locale } = useRouter()
  const { networkId } = useNetwork()

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
          <THead theadClass='rounded-t-none bg-F9FAFA' columns={getColumns()} />
          {
            !loading
              ? (
                <TBody
                  columns={getColumns()}
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
        onClick={() => {
          fetchProposals({
            page: page + 1,
            rowsPerPage,
            titleFilter: getFilterString(filter)
          })
          setPage(_page => { return _page + 1 })
        }}
        show={showMore}
        loading={loading}
      />
    </div>
  )
}
