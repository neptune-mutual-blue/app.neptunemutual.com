import { i18n } from '@lingui/core'
import { fireEvent, render, screen } from '@/utils/unit-tests/test-utils'
import { testData } from '@/utils/unit-tests/test-data'
import { ReportingDropdown } from '@/modules/reporting/reporting-dropdown'

describe('ReportingDropdown test', () => {
  beforeEach(() => {
    i18n.activate('en')

    const covers = testData.covers

    const setSelected = jest.fn()

    render(
      <ReportingDropdown
        options={covers}
        selected={covers[0]}
        setSelected={setSelected}
        selectedName={testData.coverInfo.infoObj.projectName}
        prefix={
          <div className='w-8 h-8 p-1 mr-2 rounded-full bg-DEEAF6'>
            <span>This is test prefix</span>
          </div>
        }
      />
    )
  })

  test('should render the prefix passed correctly', () => {
    const selectedCover = screen.getByText(
      testData.coverInfo.infoObj.projectName
    )

    const prefixText = screen.getByText(/This is test prefix/i)
    expect(selectedCover).toBeInTheDocument()
    expect(prefixText).toBeInTheDocument()
  })

  test('should render the list button and list items corectly', () => {
    const button = screen.getByRole('button')

    expect(button).toBeInTheDocument()
    fireEvent.click(button)
    const lists = screen.getByRole('listbox')
    const listItems = screen.queryAllByRole('option')
    expect(lists).toBeInTheDocument()
    expect(listItems.length).toBe(10)
  })
})
