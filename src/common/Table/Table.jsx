import { Fragment } from 'react'
import { t } from '@lingui/macro'
import { classNames } from '@/utils/classnames'

export const Table = ({ children }) => {
  return (
    <table className='min-w-full' role='table'>
      {children}
    </table>
  )
}

export const TableWrapper = ({ children, ...rest }) => {
  return (
    <>
      <div
        className='relative mt-8 overflow-x-scroll bg-white text-404040 rounded-3xl lg:overflow-hidden'
        {...rest}
      >
        {children}
      </div>
    </>
  )
}

export const TableShowMore = ({ isLoading = false, onShowMore }) => {
  return (
    <button
      disabled={isLoading}
      data-testid='table-show-more'
      onClick={() => {
        onShowMore()
      }}
      className={classNames(
        'block w-full p-5 border-t border-DAE2EB',
        !isLoading && 'hover:bg-F4F8FC'
      )}
    >
      {isLoading ? t`loading...` : t`Show More`}
    </button>
  )
}

export const THead = ({
  columns,
  theadClass = 'bg-black text-white',
  ...rest
}) => {
  return (
    <thead
      className={classNames(
        'rounded-sm',
        theadClass
      )} {...rest}
    >
      <tr>
        {columns.map((col, idx) => {
          return <Fragment key={idx}>{col.renderHeader(col)}</Fragment>
        })}
      </tr>
    </thead>
  )
}

// RowWrapper can probably only be a "Context Provider"
export const TBody = ({
  columns = [],
  data = [],
  isLoading = false,
  extraData = {},
  RowWrapper = Fragment
}) => {
  return (
    <tbody className='divide-y divide-DAE2EB' data-testid='app-table-body'>
      {data.length === 0 && (
        <tr className='w-full text-center'>
          <td className='p-6' colSpan={columns.length}>
            {isLoading ? t`loading...` : t`No data found`}
          </td>
        </tr>
      )}
      {data.map((row, idx) => {
        const wrapperProps = RowWrapper === Fragment ? {} : { row, extraData }

        return (
          <RowWrapper key={idx} {...wrapperProps}>
            <tr role='row'>
              {columns.map((col, _idx) => {
                return (
                  <Fragment key={_idx}>
                    {col.renderData(row, extraData)}
                  </Fragment>
                )
              })}
            </tr>
          </RowWrapper>
        )
      })}
    </tbody>
  )
}
