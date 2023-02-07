import React, { Fragment } from 'react'
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
        className='relative mt-8 overflow-x-auto bg-white border text-404040 border-B0C4DB rounded-3xl lg:overflow-hidden'
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

function isReactFragment (variableToInspect) {
  if (variableToInspect.type) {
    return variableToInspect.type === React.Fragment
  }
  return variableToInspect === React.Fragment
}

export const TableTitle = ({
  columns,
  title
}) => {
  return (
    <tr className='bg-FEFEFF'>
      <th className='px-6 py-5' colSpan={columns.length}>{title}</th>
    </tr>
  )
}

export const THead = ({
  columns,
  theadClass = 'bg-black text-white',
  rowClass = '',
  title = <></>,
  ...rest
}) => {
  return (
    <thead
      className={classNames(
        'rounded-sm',
        theadClass
      )} {...rest}
    >
      {!isReactFragment(title) && (
        <TableTitle title={title} columns={columns} />
      )}
      <tr className={classNames('border-y border-B0C4DB', rowClass)}>
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
