import { TBody, THead, Table, TableWrapper } from '@/common/Table/Table'
import { renderHeader } from '@/common/Table/renderHeader'
import { ActionsRenderer, DetailsRenderer, ResultRenderer, TagRenderer, TitleComponent, TypeRenderer, WhenRenderer } from '@/modules/governance/proposals-table/TableComponents'
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
    renderData: () => <TagRenderer />
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
    renderData: (row) => <ActionsRenderer row={row} />
  }
]

const filterOptions = [
  { name: t`All`, value: 'all' },
  { name: t`Gauge Controller Emission (GCE)`, value: 'gce' },
  { name: t`Neptune Improvement Proposal (NIP)`, value: 'nip' },
  { name: t`Gauge Controller Listing (GCL)`, value: 'gcl' },
  { name: t`Liquidity Rewards (LR)`, value: 'lr' },
  { name: t`Grants`, value: 'grants' }
]

export const ProposalsTable = () => {
  const { locale } = useRouter()

  const [filter, setFilter] = useState(filterOptions[0])

  const { data } = useSnapshotProposals()

  const filteredData = useMemo(() => {
    if (filter.value === 'all') return data

    return data.filter(proposal => proposal.tag === filter.value)
  }, [data, filter])

  return (
    <div className='mt-8'>
      <TitleComponent filter={filter} filterOptions={filterOptions} setFilter={setFilter} />
      <TableWrapper className='mt-0 rounded-t-none'>
        <Table>
          <THead theadClass='rounded-t-none bg-F9FAFA' columns={getColumns()} />
          <TBody
            columns={getColumns()}
            data={filteredData}
            extraData={{ locale }}
          />
        </Table>
      </TableWrapper>
    </div>
  )
}
