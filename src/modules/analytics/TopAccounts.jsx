import { renderHeader } from '@/common/Table/renderHeader'
import { convertFromUnits } from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'
import { t } from '@lingui/macro'
import { TableWrapper, TBody, THead, Table } from '@/common/Table/Table'
import { useAppConstants } from '@/src/context/AppConstants'
import { useRouter } from 'next/router'
import { classNames } from '@/utils/classnames'

const renderAccount = (row, _, rowIndex) => {
  return (
    <td
      className='px-6 py-4.5 text-sm whitespace-nowrap text-01052D flex gap-2.5'
    >
      <span
        className={
          classNames('w-5 h-5 rounded-full shrink-0 flex items-center justify-center',
            rowIndex < 3 ? 'bg-4e7dd9 text-white' : 'bg-DEEAF6 text-01052D'
          )
        }
      >
        {rowIndex + 1}
      </span> {row.id}
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

export const TopAccounts = ({ userData = [] }) => {
  const { liquidityTokenDecimals } = useAppConstants()
  const { locale } = useRouter()

  return (
    <TableWrapper>
      <Table>
        <THead
          columns={columns}
        />
        <TBody
          extraData={{
            liquidityTokenDecimals,
            locale
          }}
          columns={columns}
          data={userData.slice(0, 7)}
        />
      </Table>
    </TableWrapper>
  )
}
