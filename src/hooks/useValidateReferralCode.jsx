import {
  useEffect,
  useState
} from 'react'

import {
  DEBOUNCE_TIMEOUT,
  REFERRAL_CODE_VALIDATION_URL
} from '@/src/config/constants'
import { useDebounce } from '@/src/hooks/useDebounce'
import { useFetch } from '@/src/hooks/useFetch'
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
      if (isValidReferralCode(trimmedValue)) {
        let isValidRef = false

        console.log(isValidReferralCode(trimmedValue))
        try {
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
          setIsReferralCodeCheckPending(false)
        }

        setIsValid(isValidRef)
        if (isValidRef) {
          setErrorMessage('')
          return
        }

        setErrorMessage(t`Invalid Cashback Code`)
        return
      }
      setErrorMessage(t`Incorrect Cashback Code`)
      setIsValid(false)
    })()
  }, [debouncedValue, fetchValidateReferralCode, setIsReferralCodeCheckPending])

  return { isValid, errorMessage }
}
