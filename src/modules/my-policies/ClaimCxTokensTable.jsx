import React, { useState } from 'react'

import { useRouter } from 'next/router'

import { renderHeader } from '@/common/Table/renderHeader'
import {
  Table,
  TableShowMore,
  TableWrapper,
  TBody,
  THead
} from '@/common/Table/Table'
import DateLib from '@/lib/date/DateLib'
import { ClaimCoverModal } from '@/src/modules/my-policies/ClaimCoverModal'
import {
  CxTokenRowProvider,
  useCxTokenRowContext
} from '@/src/modules/my-policies/CxTokenRowContext'
import { convertFromUnits } from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'
import { fromNow } from '@/utils/formatter/relative-time'

const renderAddress = (row) => (
  <td className='max-w-sm px-6 py-6 text-sm leading-5 whitespace-nowrap text-01052D'>
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
  loading = false,
  claimPlatformFee
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
              extraData={{ coverKey, incidentDate, claimPlatformFee }}
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
          className='text-sm leading-6 whitespace-nowrap w-max text-01052D'
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
        className='text-sm leading-5 text-left whitespace-nowrap w-max text-01052D'
        title={DateLib.toLongDateFormat(claimExpiryDate, router.locale)}
      >
        {fromNow(claimExpiryDate)}
      </span>
    </td>
  )
}

export const ClaimActionsColumnRenderer = ({ row, extraData }) => {
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
        className='text-sm leading-6 tracking-wide uppercase cursor-pointer text-4E7DD9 hover:underline'
        onClick={() => {
          onOpen()
        }}
      >
        Claim
      </button>

      <ClaimCoverModal
        claimPlatformFee={extraData.claimPlatformFee}
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
