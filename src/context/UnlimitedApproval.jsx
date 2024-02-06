import React, {
  useCallback,
  useEffect,
  useState
} from 'react'

import {
  KEYS,
  LocalStorage
} from '@/utils/localstorage'
import { MaxUint256 } from '@ethersproject/constants'

const UnlimitedApprovalContext = React.createContext({
  unlimitedApproval: true,
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
  getApprovalAmount: (_value) => { return MaxUint256.toString() }
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
  const [
    unlimitedApproval,
    /**
     * @param {(value: boolean) => void}
     */
    setUnlimitedApproval
  ] = useState(true)

  useEffect(() => {
    const val = LocalStorage.get(
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

    setUnlimitedApproval(val)
  }, [])

  const _setUnlimitedApproval = useCallback(
    /**
     * @param {boolean} value
     */
    (value) => {
      LocalStorage.set(KEYS.UNLIMITED_APPROVAL, value)
      // @ts-ignore
      setUnlimitedApproval(value)
    },
    []
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
