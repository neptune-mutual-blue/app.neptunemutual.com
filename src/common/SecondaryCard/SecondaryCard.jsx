import { classNames } from '@/utils/classnames'

export const SecondaryCard = ({ children }) => {
  return (
    <div
      className={classNames(
        'border border-B0C4DB rounded-3xl flex flex-col flex-wrap justify-between px-8 py-10 bg-DEEAF6'
      )}
    >
      {children}
    </div>
  )
}
