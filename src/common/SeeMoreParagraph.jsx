import { classNames } from '@/utils/classnames'
import React, { useEffect, useState } from 'react'
import { t } from '@lingui/macro'

export const SeeMoreParagraph = ({ text = '' }) => {
  const [showFullText, setShowFullText] = useState(false)
  const [hasOverflow, setHasOverflow] = useState(false)

  const handleReadMore = () => {
    setShowFullText((prev) => !prev)
  }

  useEffect(() => {
    setHasOverflow(text.length > 144)
  }, [text])

  return (
    <div
      className={classNames(!showFullText && 'overflow-hidden flex')}
      data-testid='text-wrapper'
    >
      <p>{(!showFullText && hasOverflow) ? text.substring(0, 144) : text}
        {/* Read more */}
        {hasOverflow && (
          <span
            onClick={handleReadMore}
            className='mt-4 ml-4 underline capitalize cursor-pointer w-fit opacity-40 hover:no-underline'
            data-testid='button'
          >
            {showFullText ? t`See less` : t`See more`}
          </span>
        )}
      </p>
    </div>
  )
}
