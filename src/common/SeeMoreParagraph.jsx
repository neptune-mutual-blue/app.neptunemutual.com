import { classNames } from '@/utils/classnames'
import { useEffect, useRef, useState } from 'react'
import { t } from '@lingui/macro'

export const SeeMoreParagraph = ({ children }) => {
  const [showFullText, setShowFullText] = useState(false)
  const [hasOverflow, setHasOverflow] = useState(false)
  const wrapperRef = useRef(null)
  const elementRef = useRef(null)

  const handleReadMore = () => {
    setShowFullText((prev) => !prev)
  }

  useEffect(() => {
    setHasOverflow(
      wrapperRef.current &&
        elementRef.current &&
        elementRef.current.scrollHeight > wrapperRef.current.offsetHeight
    )
  }, [children])

  return (
    <>

      <div
        ref={wrapperRef}
        className={classNames(!showFullText && 'max-h-14 overflow-hidden')}
        data-testid='text-wrapper'
      >
        <p ref={elementRef}>{children}</p>
      </div>

      {/* Read more */}
      {hasOverflow && (
        <button
          onClick={handleReadMore}
          className='mt-4 underline capitalize cursor-pointer opacity-40 hover:no-underline'
          data-testid='button'
        >
          {showFullText ? t`See less` : t`See more`}
        </button>
      )}
    </>
  )
}
