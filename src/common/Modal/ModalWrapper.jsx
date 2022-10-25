import { classNames } from '@/utils/classnames'

export const ModalWrapper = ({ className = '', children }) => {
  return (
    <div
      className={classNames(
        'w-full relative border-[1.5px] border-B0C4DB flex flex-col p-5 text-left align-middle rounded-3xl max-h-full m-auto overflow-auto',
        'sm:p-12 xs:p-8',
        className
      )}
    >
      {children}
    </div>
  )
}
