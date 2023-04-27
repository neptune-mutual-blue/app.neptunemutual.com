import { useRouter } from 'next/router'

import { renderHeader } from '@/common/Table/renderHeader'
import {
  Table,
  TableWrapper,
  TBody,
  THead
} from '@/common/Table/Table'
import { TOP_ACCOUNTS_ROWS_PER_PAGE } from '@/src/config/constants'
import { classNames } from '@/utils/classnames'
import { formatCurrency } from '@/utils/formatter/currency'
import { t } from '@lingui/macro'

const renderAccount = (row, { page }, rowIndex) => {
  const trueRowIndex = (rowIndex + 1) + ((page - 1) * TOP_ACCOUNTS_ROWS_PER_PAGE)

  return (
    <td
      className='flex items-center gap-2 px-6 py-4 text-sm whitespace-nowrap text-01052D'
    >
      <div className='p-0.5'>
        <span
          className={
          classNames('w-5 h-5 rounded-full shrink-0 flex text-sm items-center justify-center',
            trueRowIndex < 4 ? 'bg-4E7DD9 text-white' : 'bg-DEEAF6 text-01052D'
          )
        }
        >
          {trueRowIndex}
        </span>
      </div>
      <span className='w-auto lg:w-[396px]'>{row.account}</span>
    </td>
  )
}

const renderTransactions = (row) => {
  return (
    <td
      className='max-w-xs px-6 py-4.5 text-sm leading-5 text-right whitespace-nowrap text-01052D'
    >
      {row.transactions}
    </td>
  )
}

const renderLiquidity = (row, { locale }) => {
  return (
    <td
      className='max-w-xs px-6 py-4.5 text-sm leading-5 text-right whitespace-nowrap text-01052D'
      title={
        formatCurrency(
          row.liquidity,
          locale
        ).long
      }
    >
      {
      formatCurrency(
        row.liquidity,
        locale
      ).short
    }
    </td>
  )
}

const columns = [
  {
    name: t`account`,
    align: 'left',
    renderHeader,
    renderData: renderAccount
  },
  {
    name: t`transactions`,
    align: 'right',
    renderHeader,
    renderData: renderTransactions
  },
  {
    name: t`Liquidity`,
    align: 'right',
    renderHeader,
    renderData: renderLiquidity
  }
]

export const TopAccountsByLiquidity = ({ userData = [], page = 1, loading }) => {
  const { locale } = useRouter()

  const paginatedData = userData.slice((page - 1) * TOP_ACCOUNTS_ROWS_PER_PAGE, (page - 1) * TOP_ACCOUNTS_ROWS_PER_PAGE + TOP_ACCOUNTS_ROWS_PER_PAGE)

  return (
    <TableWrapper className='mt-0'>
      <Table>
        <THead
          columns={columns}
        />
        <TBody
          extraData={{
            page,
            locale
          }}
          isLoading={loading}
          columns={columns}
          data={paginatedData}
        />
      </Table>
    </TableWrapper>
  )
}
