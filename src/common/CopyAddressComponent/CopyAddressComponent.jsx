import React, {
  useEffect,
  useRef,
  useState
} from 'react'

import CheckCircleIcon from '@/icons/CheckCircleIcon'
import CopyIcon from '@/icons/CopyIcon'
import { Trans } from '@lingui/macro'

export const CopyAddressComponent = ({ account, ...rest }) => {
  const { iconOnly, iconClassName } = rest

  const [isCopied, setIsCopied] = useState(false)
  const timeoutIdRef = useRef(null)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(account)

    setIsCopied(true)
    timeoutIdRef.current = setTimeout(() => {
      setIsCopied(false)
    }, 1500)
  }

  useEffect(() => {
    return () => {
      if (!timeoutIdRef.current) {
        return
      }
      clearTimeout(timeoutIdRef.current)
    }
  }, [])

  return (
    <button className='flex items-center cursor-pointer' onClick={handleCopy}>
      {!isCopied
        ? (
          <>
            <CopyIcon className={iconClassName || 'w-4 h-4 text-999BAB'} />
            {!iconOnly && (
              <span className='text-21AD8C text-xs tracking-normal ml-2.5'>
                <Trans>Copy Address</Trans>
              </span>
            )}
          </>
          )
        : (
          <>
            <CheckCircleIcon className={iconClassName || 'w-4 h-4 text-999BAB'} />
            {!iconOnly && (
              <span className='text-21AD8C text-xs tracking-normal ml-2.5'>
                <Trans>Copied</Trans>
              </span>
            )}
          </>
          )}
    </button>
  )
}
