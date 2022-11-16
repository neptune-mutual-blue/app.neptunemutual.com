import {
  DEBOUNCE_TIMEOUT,
  REFERRAL_CODE_VALIDATION_URL
} from '@/src/config/constants'
import { useDebounce } from '@/src/hooks/useDebounce'
import { useFetch } from '@/src/hooks/useFetch'
import { t } from '@lingui/macro'
import { utils } from '@neptunemutual/sdk'
import { useState, useEffect } from 'react'

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
 * @returns {{isValid: boolean, errorMessage: string, isPending: boolean}}
 */
export function useValidateReferralCode (referralCode) {
  const [isPending, setIsPending] = useState(false)
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
        setIsValid(false)
        return
      }

      // if there's a value we check it
      if (isValidReferralCode(trimmedValue)) {
        let isValidRef = false

        try {
          // immediately disable submit button
          setIsPending(true)

          const result = await fetchValidateReferralCode(
            REFERRAL_CODE_VALIDATION_URL,
            {
              method: 'POST',
              body: JSON.stringify({ referralCode: trimmedValue })
            }
          )

          // status 401 is a valid request rejection
          // try catch won't work here
          isValidRef = result?.message.toLowerCase() === 'ok'
        } catch (e) {
          isValidRef = false
        } finally {
          setIsPending(false)
        }

        setIsValid(isValidRef)
        if (isValidRef) {
          setErrorMessage('')
          return
        }

        setErrorMessage(t`Invalid Referral Code`)
        return
      }
      setErrorMessage(t`Incorrect Referral Code`)
      setIsValid(false)
    })()
  }, [debouncedValue, fetchValidateReferralCode])

  return { isValid, errorMessage, isPending }
}
