import React, {
  useEffect,
  useState
} from 'react'

import { classNames } from '@/utils/classnames'
import { Trans } from '@lingui/macro'

export const SeeMoreParagraph = ({ text = '' }) => {
  const [showFullText, setShowFullText] = useState(false)
  const [hasOverflow, setHasOverflow] = useState(false)

  const handleReadMore = () => {
    setShowFullText((prev) => { return !prev })
  }

  useEffect(() => {
    setHasOverflow(text.split(' ').length > 144)
  }, [text])

  return (
    <div
      className={classNames(!showFullText && 'overflow-hidden flex')}
      data-testid='text-wrapper'
    >
      <p>{(!showFullText && hasOverflow) ? text.split(' ').slice(0, 144).join(' ') : text}
        {/* Read more */}
        {hasOverflow && (
          <span
            onClick={handleReadMore}
            className='mt-4 ml-4 underline capitalize cursor-pointer w-fit opacity-40 hover:no-underline'
            data-testid='button'
          >
            {showFullText ? <Trans>See less</Trans> : <Trans>See more</Trans>}
          </span>
        )}
      </p>
    </div>
  )
}
