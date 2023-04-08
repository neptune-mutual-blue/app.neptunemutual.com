import { renderHeader } from '@/common/Table/renderHeader'
import { convertFromUnits } from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'
import { t } from '@lingui/macro'
import { TableWrapper, TBody, THead, Table } from '@/common/Table/Table'
import { useAppConstants } from '@/src/context/AppConstants'
import { useRouter } from 'next/router'
import { classNames } from '@/utils/classnames'
import { TOP_ACCOUNTS_ROWS_PER_PAGE } from '@/src/config/constants'

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
            trueRowIndex < 4 ? 'bg-4e7dd9 text-white' : 'bg-DEEAF6 text-01052D'
          )
        }
        >
          {trueRowIndex}
        </span>
      </div>
      <span className='w-auto lg:w-[396px]'>{row.id}</span>
    </td>
  )
}

const renderPolicies = (row) => {
  return (
    <td
      className='max-w-xs px-6 py-4.5 text-sm leading-5 text-right whitespace-nowrap text-01052D'
    >
      {row.purchasedCoverCount}
    </td>
  )
}

const renderProtection = (row, { liquidityTokenDecimals, locale }) => {
  return (
    <td
      className='max-w-xs px-6 py-4.5 text-sm leading-5 text-right whitespace-nowrap text-01052D'
      title={
        formatCurrency(
          convertFromUnits(
            row.totalProtection,
            liquidityTokenDecimals
          ).toString(),
          locale
        ).long
      }
    >
      {
      formatCurrency(
        convertFromUnits(
          row.totalProtection,
          liquidityTokenDecimals
        ).toString(),
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
    name: t`policies`,
    align: 'right',
    renderHeader,
    renderData: renderPolicies
  },
  {
    name: t`protection`,
    align: 'right',
    renderHeader,
    renderData: renderProtection
  }
]

export const TopAccounts = ({ userData = [], page = 1, loading }) => {
  const { liquidityTokenDecimals } = useAppConstants()
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
            liquidityTokenDecimals,
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
