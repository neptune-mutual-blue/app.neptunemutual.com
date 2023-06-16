import {
  ActiveReportingEmptyState
} from '@/modules/reporting/active/ActiveReportingEmptyState'
import { initiateTest } from '@/utils/unit-tests/helpers'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { testData } from '@/utils/unit-tests/test-data'
import {
  fireEvent,
  screen
} from '@testing-library/react'

describe('ActiveReportingEmptyState loading state', () => {
  const { initialRender, rerenderFn } = initiateTest(ActiveReportingEmptyState, {}, () => {
    mockHooksOrMethods.useRouter()
    mockHooksOrMethods.useCoverDropdown()
  })

  beforeEach(() => {
    initialRender()
  })

  test('should render loading when hook returns loading', () => {
    rerenderFn({}, () => {
      mockHooksOrMethods.useCoverDropdown(() => { return { ...testData.coverDropdown, loading: true } })
    })
    const loadingText = screen.getByText(/loading.../)
    expect(loadingText).toBeInTheDocument()
  })

  test('should render main container when loading is false', () => {
    const container = screen.getByTestId('active-reporting-empty')
    expect(container).toBeInTheDocument()
  })

  test('should call handleAddReport after clicking on report button', () => {
    rerenderFn({}, () => {
      mockHooksOrMethods.useCoverDropdown(() => { return { ...testData.coverDropdown, loading: false } })
    })

    const button = screen.getByTestId('report-button')
    fireEvent.click(button)
    expect(testData.router.push).toHaveBeenCalled()
  })
})
