import { OutlinedButton } from '@/common/Button/OutlinedButton'
import LeftArrow from '@/icons/LeftArrow'
import { classNames } from '@/utils/classnames'
import { Trans } from '@lingui/macro'

export const BackButton = ({ onClick, className = '' }) => (
  <OutlinedButton
    className={classNames(
      'flex group items-center rounded-big border border-solid border-4E7DD9',
      className
    )}
    onClick={onClick}
  >
    <LeftArrow />
    <Trans>Back</Trans>
  </OutlinedButton>
)
