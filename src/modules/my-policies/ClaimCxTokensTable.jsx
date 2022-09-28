import React, { useState } from 'react'

import {
  Table,
  TBody,
  TableWrapper,
  THead,
  TableShowMore
} from '@/common/Table/Table'
import { classNames } from '@/utils/classnames'
import { ClaimCoverModal } from '@/src/modules/my-policies/ClaimCoverModal'
import { fromNow } from '@/utils/formatter/relative-time'
import DateLib from '@/lib/date/DateLib'
import { formatCurrency } from '@/utils/formatter/currency'
import { convertFromUnits } from '@/utils/bn'
import {
  CxTokenRowProvider,
  useCxTokenRowContext
} from '@/src/modules/my-policies/CxTokenRowContext'
import { useRouter } from 'next/router'
import { useCoverStatsContext } from '@/common/Cover/CoverStatsContext'

const renderHeader = (col) => (
  <th
    scope='col'
    className={classNames(
      'px-6 py-6 font-bold text-sm uppercase whitespace-nowrap',
      col.align === 'right' ? 'text-right' : 'text-left'
    )}
  >
    {col.name}
  </th>
)

const renderAddress = (row) => (
  <td className='max-w-sm px-6 py-6 text-404040 whitespace-nowrap'>
    {row.cxToken.id}
  </td>
)

const renderClaimBefore = (_row) => <ClaimBeforeColumnRenderer />

const renderAmount = (_row) => <CxTokenAmountRenderer />

const renderActions = (row, extraData) => {
  return <ClaimActionsColumnRenderer row={row} extraData={extraData} />
}

export const columns = [
  {
    name: 'cxToken Address',
    align: 'left',
    renderHeader,
    renderData: renderAddress
  },
  {
    name: 'Claim before',
    align: 'left',
    renderHeader,
    renderData: renderClaimBefore
  },
  {
    name: 'Amount',
    align: 'right',
    renderHeader,
    renderData: renderAmount
  },
  {
    name: '',
    align: 'right',
    renderHeader,
    renderData: renderActions
  }
]

const ClaimTableContext = React.createContext({ report: null })
export function useClaimTableContext () {
  const context = React.useContext(ClaimTableContext)
  if (context === undefined) {
    throw new Error(
      'useClaimTableContext must be used within a ClaimTableContext.Provider'
    )
  }
  return context
}

export const ClaimCxTokensTable = ({
  activePolicies,
  coverKey,
  incidentDate,
  report,
  setPage,
  hasMore = false,
  loading = false
}) => {
  return (
    <>
      <ClaimTableContext.Provider value={{ report }}>
        <TableWrapper data-testid='table-wrapper'>
          <Table>
            <THead columns={columns} data-testid='table-header' />
            <TBody
              columns={columns}
              data={activePolicies}
              extraData={{ coverKey, incidentDate }}
              RowWrapper={CxTokenRowProvider}
              isLoading={loading}
            />
          </Table>
          {hasMore && (
            <TableShowMore
              isLoading={loading}
              onShowMore={() => {
                setPage((prev) => prev + 1)
              }}
            />
          )}
        </TableWrapper>
      </ClaimTableContext.Provider>
    </>
  )
}

const CxTokenAmountRenderer = () => {
  const { balance, tokenSymbol, tokenDecimals } = useCxTokenRowContext()
  const router = useRouter()

  return (
    <>
      <td className='max-w-sm px-6 py-6 text-right'>
        <span
          className='whitespace-nowrap w-max'
          title={
            formatCurrency(
              convertFromUnits(balance, tokenDecimals),
              router.locale,
              tokenSymbol,
              true
            ).long
          }
        >
          {
            formatCurrency(
              convertFromUnits(balance, tokenDecimals),
              router.locale,
              tokenSymbol,
              true
            ).short
          }
        </span>
      </td>
    </>
  )
}

export const ClaimBeforeColumnRenderer = () => {
  const { report } = useClaimTableContext()
  const claimExpiryDate = report?.claimExpiresAt || 0
  const router = useRouter()

  return (
    <td className='max-w-sm px-6 py-6'>
      <span
        className='text-left whitespace-nowrap w-max'
        title={DateLib.toLongDateFormat(claimExpiryDate, router.locale)}
      >
        {fromNow(claimExpiryDate)}
      </span>
    </td>
  )
}

export const ClaimActionsColumnRenderer = ({ row, extraData }) => {
  const { claimPlatformFee } = useCoverStatsContext()
  const [isOpen, setIsOpen] = useState(false)

  const onClose = () => {
    setIsOpen(false)
  }

  const onOpen = () => {
    setIsOpen(true)
  }

  return (
    <td className='px-6 py-6 text-right min-w-120'>
      <button
        className='cursor-pointer text-4e7dd9 hover:underline'
        onClick={onOpen}
      >
        Claim
      </button>

      <ClaimCoverModal
        claimPlatformFee={claimPlatformFee}
        coverKey={row.coverKey}
        productKey={row.productKey}
        cxTokenAddress={row.cxToken.id}
        isOpen={isOpen}
        onClose={onClose}
        modalTitle='Claim Cover'
        incidentDate={extraData.incidentDate}
      />
    </td>
  )
}
