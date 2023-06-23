import React from 'react'
import { render, act } from '@/utils/unit-tests/test-utils'
import { createMockTableData } from '@/utils/unit-tests/createMockData'
import { Table, TBody, THead } from '@/common/Table/Table'
import { classNames } from '@/utils/classnames'
import { t } from '@lingui/macro'
import { i18n } from '@lingui/core'

const mockData = createMockTableData({
  count: 3,
  fields: ['field1', 'field2']
})

const renderHeader = (col) => {
  return (
    <th
      scope='col'
      role='columnheader'
      className={classNames(
        'px-6 py-6 font-bold text-sm uppercase',
        col.align === 'right' ? 'text-right' : 'text-left'
      )}
    >
      {col.name}
    </th>
  )
}

const renderFirstColumnData = (row) => {
  return (
    <td className='px-6 py-6' role='cell'>
      {row.field1}
    </td>
  )
}

const renderSecondColumnData = (row) => {
  return <td className='px-6 py-6'>{row.field2}</td>
}

const mockColumns = [
  {
    name: 'Column 1',
    renderHeader,
    renderData: renderFirstColumnData
  },
  {
    name: 'Column 2',
    renderHeader,
    renderData: renderSecondColumnData
  }
]

describe('Table', () => {
  beforeAll(() => {
    act(() => {
      i18n.activate('en')
    })
  })

  describe('should render Table properly', () => {
    test('has correct number of rows and columns', async () => {
      const { getAllByRole, getByTestId } = render(
        <Table>
          <THead columns={mockColumns} />
          <TBody columns={mockColumns} data={mockData} />
        </Table>
      )

      const columnHeaders = getAllByRole('columnheader')
      const tableBody = getByTestId('app-table-body')

      expect(tableBody.children).toHaveLength(mockData.length)
      expect(columnHeaders).toHaveLength(mockColumns.length)
    })

    test('display correct data on each cell', async () => {
      const { getAllByRole, getByTestId } = render(
        <Table>
          <THead columns={mockColumns} />
          <TBody columns={mockColumns} data={mockData} />
        </Table>
      )

      const columnHeaders = getAllByRole('columnheader')
      const tableBody = getByTestId('app-table-body')
      const tableCells = getAllByRole('cell')

      expect(tableBody.children).toHaveLength(mockData.length)
      expect(columnHeaders).toHaveLength(mockColumns.length)

      expect(columnHeaders[0]).toHaveTextContent(mockColumns[0].name)
      expect(columnHeaders[1]).toHaveTextContent(mockColumns[1].name)
      expect(tableCells[0]).toHaveTextContent(mockData[0].field1)
      expect(tableCells[1]).toHaveTextContent(mockData[0].field2)
      expect(tableCells[2]).toHaveTextContent(mockData[1].field1)
      expect(tableCells[3]).toHaveTextContent(mockData[1].field2)
    })
  })

  describe('Should render table loading', () => {
    test('show table loading message', async () => {
      const { getByText } = render(
        <Table>
          <THead columns={mockColumns} />
          <TBody columns={mockColumns} data={[]} isLoading />
        </Table>
      )

      const loadingMessage = getByText(t`loading...`)
      expect(loadingMessage).toBeInTheDocument()
    })
  })

  // describe('Should render show more button', () => {
  //   test('calls onShowMore prop when clicked', async () => {
  //     const handleShowMore = jest.fn()
  //     const { getByTestId } = render(
  //       <TableShowMore onShowMore={handleShowMore} />
  //     )

  //     const button = getByTestId('table-show-more')

  //     fireEvent.click(button)

  //     expect(handleShowMore).toHaveBeenCalledTimes(1)
  //   })
  // })
})
