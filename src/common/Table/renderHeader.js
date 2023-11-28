import DownArrow from '@/icons/DownArrow'
import { classNames } from '@/utils/classnames'

export const renderHeader = (col, sortKey, sorts, handleSort, className) => {
  const sortFn = handleSort ? () => { return handleSort(col.name, sortKey) } : () => {}

  const CellChild = () => {
    if (sortKey) {
      return (
        <button
          className={classNames(
            'flex gap-1 w-max cursor-pointer',
            col.align === 'right' ? 'ml-auto' : 'mr-auto'
          )}
          onClick={sortFn}
        >
          <span
            className='font-semibold text-xs leading-4.5 uppercase whitespace-nowrap'
          >
            {col.name}
          </span>
          <DownArrow className={classNames(
            'transform',
            sorts[col.id] && (sorts[col.id].type === 'asc' ? 'rotate-180' : 'rotate-0')
          )}
          />
        </button>
      )
    }

    return <>{col.name}</>
  }

  return (
    <th
      scope='col'
      className={classNames(
        'px-6 py-3 font-semibold text-xs leading-4.5 uppercase whitespace-nowrap text-404040',
        className,
        col.align === 'right' ? 'text-right' : 'text-left'
      )}
    >
      <CellChild />
    </th>
  )
}
