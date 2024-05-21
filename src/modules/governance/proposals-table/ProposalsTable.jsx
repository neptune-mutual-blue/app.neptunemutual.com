import { useEffect, useState } from 'react'

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

/**
 * Returns an array of column objects for the proposals table.
 * Each object represents a column and contains properties such as id, name, alignment, and render functions.
 *
 * @param {import('@lingui/core').I18n} i18n - The I18n instance from Lingui library.
 * @returns {Array<{id: string, name: string, align: string, renderHeader: Function, renderData: (row: any, extraData: any, index: number) => React.JSX.Element}>} An array of column objects.
 */
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

/**
 * Returns an array of column objects for the proposals table.
 * Each object represents a column and contains properties such as id, name, alignment, and render functions.
 *
 * @param {import('@lingui/core').I18n} i18n - The I18n instance from Lingui library.
 * @returns {Array.<{name: string, value: string, query: string}>} An array of column objects.
 */
const getFilterOptions = (i18n) => {
  return [
    { name: t(i18n)`All`, value: 'all', query: '' },
    { name: t(i18n)`Gauge Controller Emission (GCE)`, value: '[gce', query: 'gce' },
    { name: t(i18n)`Neptune Improvement Proposal (NIP)`, value: '[nip', query: 'nip' },
    { name: t(i18n)`Gauge Controller Listing (GCL)`, value: '[gcl', query: 'gcl' },
    { name: t(i18n)`Liquidity Rewards (LR)`, value: '[lr', query: 'lr' },
    { name: t(i18n)`Grants`, value: '[grant', query: 'grants' }
  ]
}

const rowsPerPageOptions = [5, 10, 15, 30, 50, 100]

export const DEFAULT_ROWS_PER_PAGE = rowsPerPageOptions[4]

const getFilterString = item => {
  return item.value !== 'all' ? item.value : ''
}

export const ProposalsTable = () => {
  const { locale, query, replace } = useRouter()
  const { networkId } = useNetwork()

  const { i18n } = useLingui()

  const filterOptions = getFilterOptions(i18n)

  const [filter, setFilter] = useState(filterOptions[0])

  const [page, setPage] = useState(1)
  const [rowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE)
  const { data, fetchProposals, loading, lastFetchedLength } = useSnapshotProposals()

  const showMore = (lastFetchedLength >= rowsPerPage)

  const titleFilter = getFilterString(filter)

  useEffect(() => {
    fetchProposals({ page, rowsPerPage, titleFilter })
  }, [fetchProposals, page, rowsPerPage, titleFilter])

  useEffect(() => {
    const queryFilter = query.filter
    const selectedFilter = filterOptions.find((item) => { return item.query === queryFilter }) || filterOptions[0]

    if (selectedFilter) {
      setFilter(prev => {
        if (prev.value === selectedFilter.value) { return prev }

        return selectedFilter
      })
    }
  }, [query, filterOptions])

  const handleFilterChange = (val) => {
    const newUrl = { query: { ...query } }

    if (val.value === filter.value || val.query === '') {
      delete newUrl.query.filter
    } else {
      newUrl.query.filter = val.query
    }

    replace(newUrl, undefined, { shallow: true })
    setPage(1)
  }

  return (
    <div className='mt-8'>
      <TitleComponent
        filter={filter}
        filterOptions={filterOptions}
        setFilter={handleFilterChange}
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
          setPage(_page => { return _page + 1 })
        }}
      />
    </div>
  )
}
