import { classNames } from '@/utils/classnames'

export const Divider = ({ className = 'mb-8' }) => {
  return (
    <hr className={classNames('mt-4  border-t border-B0C4DB', className)} />
  )
}
