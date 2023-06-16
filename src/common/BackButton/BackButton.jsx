import LeftArrow from '@/icons/LeftArrow'
import { classNames } from '@/utils/classnames'
import { Trans } from '@lingui/macro'

export const BackButton = ({ onClick, className = '' }) => {
  return (
    <button
      type='button'
      onClick={onClick}
      className={classNames(
        'flex items-center rounded-lg py-3 px-4 border-none bg-E6EAEF hover:bg-opacity-80 disabled:bg-EEEEEE uppercase disabled:text-9B9B9B text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-4E7DD9 tracking-2 text-md',
        className
      )}
    >
      <LeftArrow />
      <Trans>Back</Trans>
    </button>
  )
}
