import { useERC20Balance } from '@/src/hooks/useERC20Balance'
import React from 'react'

const CxTokenRowContext = React.createContext({
  tokenAddress: '',
  tokenSymbol: '',
  tokenDecimals: 0,
  loadingBalance: false,
  balance: '0',
  refetchBalance: async () => {}
})

export const CxTokenRowProvider = ({ row, _extraData, ...props }) => {
  const tokenAddress = row.cxToken.id
  const tokenSymbol = row.cxToken.tokenSymbol
  const tokenDecimals = row.cxToken.tokenDecimals
  const {
    balance,
    loading: loadingBalance,
    refetch: refetchBalance
  } = useERC20Balance(tokenAddress)

  return (
    <CxTokenRowContext.Provider
      value={{
        tokenSymbol,
        tokenAddress,
        tokenDecimals,
        balance,
        loadingBalance,
        refetchBalance
      }}
      {...props}
    />
  )
}

export function useCxTokenRowContext () {
  const context = React.useContext(CxTokenRowContext)
  if (context === undefined) {
    throw new Error(
      'useCxTokenRowContext must be used within a CxTokenRowContext.Provider'
    )
  }

  return context
}
