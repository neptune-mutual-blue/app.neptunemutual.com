import {
  useEffect,
  useState
} from 'react'

import { DEBOUNCE_TIMEOUT } from '@/src/config/constants'
import { useDebounce } from '@/src/hooks/useDebounce'
import { useFetch } from '@/src/hooks/useFetch'
import {
  validateReferralCode
} from '@/src/services/api/policy/validate-referral-code'
import { t } from '@lingui/macro'
import { utils } from '@neptunemutual/sdk'

/**
 *
 * @param {string} referralCode
 * @returns {boolean}
 */
function isValidReferralCode (referralCode) {
  try {
    utils.keyUtil.toBytes32(referralCode.trim())

    return true
  } catch (e) {
    return false
  }
}

/**
 *
 * @param {string} referralCode
 * @returns {{isValid: boolean, errorMessage: string}}
 */
export function useValidateReferralCode (referralCode, setIsReferralCodeCheckPending) {
  const [isValid, setIsValid] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const fetchValidateReferralCode = useFetch('fetchValidateReferralCode')
  const debouncedValue = useDebounce(referralCode, DEBOUNCE_TIMEOUT)

  useEffect(() => {
    (async () => {
      const trimmedValue = debouncedValue.trim()

      if (trimmedValue.length === 0) {
        // if it's empty we set true immediately
        setErrorMessage('')
        setIsValid(true)

        return
      }

      // if there's a value we check it
      if (!isValidReferralCode(trimmedValue)) {
        setErrorMessage(t`Incorrect Cashback Code`)
        setIsValid(false)

        return
      }

      let isValidCode = false

      try {
        isValidCode = await validateReferralCode(trimmedValue)
      } catch (e) {
        isValidCode = false
      } finally {
        setIsReferralCodeCheckPending(false)
        setIsValid(isValidCode)
      }

      setErrorMessage(isValidCode ? '' : t`Invalid Cashback Code`)
    })()
  }, [debouncedValue, fetchValidateReferralCode, setIsReferralCodeCheckPending])

  return { isValid, errorMessage }
}
