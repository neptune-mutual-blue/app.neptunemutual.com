import { TBody, THead, Table, TableWrapper } from '@/common/Table/Table'
import { renderHeader } from '@/common/Table/renderHeader'
import { ActionsRenderer, DetailsRenderer, ResultRenderer, TablePagination, TableRowsSkeleton, TagRenderer, TitleComponent, TypeRenderer, WhenRenderer } from '@/modules/governance/proposals-table/TableComponents'
import { useNetwork } from '@/src/context/Network'
import { useSnapshotProposals } from '@/src/hooks/useSnapshotProposals'
import { t } from '@lingui/macro'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'

export const getColumns = () => [
  {
    name: t`when`,
    align: 'left',
    renderHeader,
    renderData: (row, { locale }) => <WhenRenderer row={row} locale={locale} />
  },
  {
    name: t``,
    align: 'center',
    renderHeader,
    renderData: (row) => <TypeRenderer row={row} />
  },
  {
    name: t`details`,
    align: 'left',
    renderHeader,
    renderData: (row) => <DetailsRenderer row={row} />
  },
  {
    name: t``,
    align: 'center',
    renderHeader,
    renderData: (row) => <TagRenderer row={row} />
  },
  {
    name: 'Result',
    align: 'right',
    renderHeader,
    renderData: (row) => <ResultRenderer row={row} />
  },
  {
    name: 'Actions',
    align: 'right',
    renderHeader,
    renderData: (row, { networkId }) => <ActionsRenderer row={row} networkId={networkId} />
  }
]

const filterOptions = [
  { name: t`All`, value: 'all' },
  { name: t`Gauge Controller Emission (GCE)`, value: ['gce'] },
  { name: t`Neptune Improvement Proposal (NIP)`, value: ['nip'] },
  { name: t`Gauge Controller Listing (GCL)`, value: ['gcl'] },
  { name: t`Liquidity Rewards (LR)`, value: ['lr'] },
  { name: t`Grants`, value: ['grant', 'grants'] }
]

const rowsPerPageOptions = [5, 10, 15, 30, 50, 100]

export const ProposalsTable = () => {
  const { locale } = useRouter()
  const { networkId } = useNetwork()

  const [filter, setFilter] = useState(filterOptions[0])

  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[4])

  const { data, fetchProposals, total, loading } = useSnapshotProposals()

  const filteredData = useMemo(() => {
    if (filter.value === 'all') return data.slice(0, rowsPerPage)

    return data
      .filter(proposal => filter.value.includes(proposal.tag))
      .slice(0, rowsPerPage)
  }, [data, filter, rowsPerPage])

  const hasMoreItems = total > (((page - 1) * rowsPerPage) + data.length)

  return (
    <div className='mt-8'>
      <TitleComponent filter={filter} filterOptions={filterOptions} setFilter={setFilter} />
      <TableWrapper className='mt-0 rounded-none'>
        <Table>
          <THead theadClass='rounded-t-none bg-F9FAFA' columns={getColumns()} />
          {
            !loading
              ? (
                <TBody
                  columns={getColumns()}
                  data={filteredData}
                  extraData={{ locale, networkId }}
                />
                )
              : (
                <TableRowsSkeleton rowCount={rowsPerPage} />
                )
          }
        </Table>
      </TableWrapper>
      <TablePagination
        options={rowsPerPageOptions}
        setRowsPerPage={(num) => {
          fetchProposals({ page: 1, rowsPerPage: num })
          setRowsPerPage(num)
          setPage(1)
        }}
        onPrev={() => {
          fetchProposals({ page: page - 1, rowsPerPage })
          setPage(page - 1)
        }}
        onNext={() => {
          fetchProposals({ page: page + 1, rowsPerPage })
          setPage(page + 1)
        }}
        hasPrev={page > 1}
        hasNext={hasMoreItems}
        currentPage={page}
        currentItems={data.length}
        rowsPerPage={rowsPerPage}
        totalItems={total}
        loading={loading}
      />
    </div>
  )
}
