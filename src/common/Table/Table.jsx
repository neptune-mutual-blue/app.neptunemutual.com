import React, { Fragment } from 'react'

import { NeutralButton } from '@/common/Button/NeutralButton'
import {
  Loading,
  NoDataFound
} from '@/common/Loading'
import { classNames } from '@/utils/classnames'
import { Trans } from '@lingui/macro'

export const Table = ({ children }) => {
  return (
    <table className='min-w-full' role='table'>
      {children}
    </table>
  )
}

export const TableWrapper = ({ children, className = '', ...rest }) => {
  return (
    <>
      <div
        className={classNames(
          'relative mt-8 overflow-x-auto bg-white border text-404040 border-B0C4DB rounded-xl',
          className
        )}
        {...rest}
      >
        {children}
      </div>
    </>
  )
}

export const TableShowMore = ({ show, loading = false, onShowMore, className = '', ...rest }) => {
  if (!show) { return null }

  return (
    <NeutralButton
      className={classNames('mt-4', className)}
      disabled={loading}
      onClick={onShowMore}
      {...rest}
    >
      <Trans>Show More</Trans>
    </NeutralButton>
  )
}

export const TableTitle = ({
  columns,
  title
}) => {
  if (!title || !columns) {
    return null
  }

  return (
    <tr className='bg-FEFEFF'>
      <th className='px-6 py-5' colSpan={columns.length}>{title}</th>
    </tr>
  )
}

/**
 *
 * @param {Object} props
 * @param {any[]} props.columns
 * @param {string} [props.theadClass]
 * @param {string} [props.rowClass]
 * @param {string | import('react').ReactElement} [props.title]
 * @returns
 */
export const THead = ({
  columns,
  theadClass = 'bg-F9FAFA text-white',
  rowClass = '',
  title = '',
  ...rest
}) => {
  return (
    <thead
      className={classNames(
        'rounded-sm',
        theadClass
      )} {...rest}
    >
      <TableTitle title={title} columns={columns} />
      <tr className={classNames('border-y border-B0C4DB', rowClass, !title && 'border-t-0')}>
        {columns.map((col, idx) => {
          return <Fragment key={idx}>{col.renderHeader(col)}</Fragment>
        })}
      </tr>
    </thead>
  )
}

/**
 * RowWrapper can probably only be a "Context Provider"
 *
 * @param {Object} props
 * @param {boolean} [props.isLoading] loading
 * @param {Function} [props.onRowClick] handle event
 * @param {Array<{renderData: (row: any, extraData: any, index: number) => React.JSX.Element}>} [props.columns]
 * @param {any} [props.data]
 * @param {any} [props.extraData]
 * @param {React.FC} [props.RowWrapper] wrapper for each row - used for context provider
 * @returns
 */
export const TBody = ({
  columns = [],
  data = [],
  isLoading = false,
  extraData = {},
  RowWrapper = Fragment,
  onRowClick = undefined
}) => {
  return (
    <tbody className='divide-y divide-DAE2EB' data-testid='app-table-body'>
      {data.length === 0 && (
        <tr className='w-full text-center'>
          <td className='p-6' colSpan={columns.length}>
            {isLoading ? <Loading /> : <NoDataFound />}
          </td>
        </tr>
      )}
      {data.map((row, idx) => {
        const wrapperProps = RowWrapper === Fragment ? {} : { row, extraData }

        return (
          <RowWrapper key={idx} {...wrapperProps}>
            <tr className={onRowClick ? 'cursor-pointer' : undefined} onClick={() => { return onRowClick ? onRowClick(idx) : () => {} }} role='row'>
              {columns.map((col, _idx) => {
                return (
                  <Fragment key={_idx}>
                    {col.renderData(row, extraData, idx)}
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
