import { TBody, THead, Table, TableWrapper } from '@/common/Table/Table'
import { renderHeader } from '@/common/Table/renderHeader'
import { ActionsRenderer, DetailsRenderer, ResultRenderer, TableRowsSkeleton, TagRenderer, TitleComponent, TypeRenderer, WhenRenderer } from '@/modules/governance/proposals-table/TableComponents'
import { useNetwork } from '@/src/context/Network'
import { useSnapshotProposals } from '@/src/hooks/useSnapshotProposals'
import { t } from '@lingui/macro'
import { useRouter } from 'next/router'
import { useState } from 'react'

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
  { name: t`Gauge Controller Emission (GCE)`, value: 'gce' },
  { name: t`Neptune Improvement Proposal (NIP)`, value: 'nip' },
  { name: t`Gauge Controller Listing (GCL)`, value: 'gcl' },
  { name: t`Liquidity Rewards (LR)`, value: 'lr' },
  { name: t`Grants`, value: 'grant' }
]

const rowsPerPageOptions = [5, 10, 15, 30, 50, 100]

const getFilterString = item => {
  return item.value !== 'all' ? item.value : ''
}

export const ProposalsTable = () => {
  const { locale } = useRouter()
  const { networkId } = useNetwork()

  const [filter, setFilter] = useState(filterOptions[0])

  const [rowsPerPage] = useState(rowsPerPageOptions[4])
  const { data, fetchProposals, loading } = useSnapshotProposals()

  return (
    <div className='mt-8'>
      <TitleComponent
        filter={filter}
        filterOptions={filterOptions}
        setFilter={(val) => {
          if (val.value === filter.value) return
          fetchProposals({ page: 1, rowsPerPage, titleFilter: getFilterString(val) })
          setFilter(val)
        }}
      />
      <TableWrapper className='mt-0 rounded-t-none'>
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
                <TableRowsSkeleton rowCount={rowsPerPage} />
                )
          }
        </Table>
      </TableWrapper>
    </div>
  )
}
