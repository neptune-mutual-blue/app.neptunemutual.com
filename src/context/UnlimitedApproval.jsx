import React, {
  useCallback,
  useState
} from 'react'

import { logUnlimitedApprovalToggled } from '@/src/services/logs'
import {
  KEYS,
  LocalStorage
} from '@/utils/localstorage'
import { analyticsLogger } from '@/utils/logger'
import { MaxUint256 } from '@ethersproject/constants'
import { useWeb3React } from '@web3-react/core'

const UnlimitedApprovalContext = React.createContext({
  unlimitedApproval: false,
  /**
   * @param {boolean} _value
   * @returns {any}
   */
  setUnlimitedApproval: (_value) => {},
  /**
   * @typedef {number | string} ApprovalAmount
   *
   * @param {ApprovalAmount} _value
   * @returns {ApprovalAmount}
   */
  getApprovalAmount: (_value) => MaxUint256.toString()
})

export function useUnlimitedApproval () {
  const context = React.useContext(UnlimitedApprovalContext)

  if (context === undefined) {
    throw new Error(
      'useUnlimitedApproval must be used within a UnlimitedApprovalProvider'
    )
  }
  return context
}

export const UnlimitedApprovalProvider = ({ children }) => {
  const { account, chainId } = useWeb3React()
  const [
    unlimitedApproval,
    /**
     * @param {(value: boolean) => void}
     */
    setUnlimitedApproval
  ] = useState(() =>
    LocalStorage.get(
      KEYS.UNLIMITED_APPROVAL,
      (value) => {
        const result = JSON.parse(value)

        if (typeof result === 'boolean') {
          return result
        }

        throw new Error(LocalStorage.LOCAL_STORAGE_ERRORS.INVALID_SHAPE)
      },
      true
    )
  )

  const _setUnlimitedApproval = useCallback(
    /**
     * @param {boolean} value
     */
    (value) => {
      LocalStorage.set(KEYS.UNLIMITED_APPROVAL, value)
      // @ts-ignore
      setUnlimitedApproval(value)
      analyticsLogger(() => logUnlimitedApprovalToggled(chainId ?? null, account ?? null, value))
    },
    [account, chainId]
  )

  const getApprovalAmount = useCallback(
    /**
     * @param {ApprovalAmount} amount
     * @returns {ApprovalAmount}
     */
    (amount) => {
      if (unlimitedApproval) {
        return MaxUint256.toString()
      }

      return amount
    },
    [unlimitedApproval]
  )

  return (
    <UnlimitedApprovalContext.Provider
      value={{
        unlimitedApproval,
        setUnlimitedApproval: _setUnlimitedApproval,
        getApprovalAmount
      }}
    >
      {children}
    </UnlimitedApprovalContext.Provider>
  )
}
