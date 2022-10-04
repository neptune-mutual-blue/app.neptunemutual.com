import { classNames } from '@/utils/classnames'

export const ModalWrapper = ({ className = '', children }) => {
  return (
    <div
      role='dialog'
      className={classNames(
        'border-[1.5px] border-B0C4DB relative inline-block p-8 sm:p-12 text-left align-middle rounded-3xl',
        className
      )}
    >
      {children}
    </div>
  )
}
