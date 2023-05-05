import {
  ActiveReportingEmptyState
} from '@/modules/reporting/active/ActiveReportingEmptyState'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import {
  initiateTest
} from '@/utils/unit-tests/helpers'
import {
  fireEvent,
  screen
} from '@testing-library/react'

describe('ActiveReportingEmptyState loading state', () => {
  beforeEach(() => {
    mockHooksOrMethods.useRouter()
    // mockHooksOrMethods.useFlattenedCoverProducts({ loading: true })
    // mockHooksOrMethods.useCoverOrProductData()

    const { initialRender } = initiateTest(ActiveReportingEmptyState, {})

    initialRender()
  })

  test('should render loading when hook returns loading', () => {
    const loadingText = screen.getByText(/loading.../)
    expect(loadingText).toBeInTheDocument()
  })
})

describe('ActiveReportingEmptyState details', () => {
  // const handleAddReport = jest.fn(() => {});

  beforeEach(() => {
    mockHooksOrMethods.useRouter()
    // mockHooksOrMethods.useFlattenedCoverProducts()
    // mockHooksOrMethods.useCoverOrProductData()

    const { initialRender } = initiateTest(ActiveReportingEmptyState, {})

    initialRender()
  })

  test('should render loading when hook returns loading', () => {
    const emptyText = screen.getByText(/No known incident found/i)
    expect(emptyText).toBeInTheDocument()
  })

  test('should call handleAddReport after clicking on report button', () => {
    const buttons = screen.getAllByRole('button')
    expect(buttons[1]).toHaveTextContent('REPORT AN INCIDENT')
    fireEvent.click(buttons[0])
    const options = screen.getAllByRole('option')
    fireEvent.click(options[0])
  })
})

describe('ActiveReportingEmptyState details with productKey', () => {
  // const handleAddReport = jest.fn(() => {});

  beforeEach(() => {
    mockHooksOrMethods.useRouter()
    // mockHooksOrMethods.useFlattenedCoverProducts()
    // mockHooksOrMethods.useCoverOrProductData(() => testData.productInfo)

    const { initialRender } = initiateTest(ActiveReportingEmptyState, {})

    initialRender()
  })

  test('should render loading when hook returns loading', () => {
    const emptyText = screen.getByText(/No known incident found/i)
    expect(emptyText).toBeInTheDocument()
  })

  test('should call handleAddReport after clicking on report button', () => {
    const buttons = screen.getAllByRole('button')
    expect(buttons[1]).toHaveTextContent('REPORT AN INCIDENT')
    fireEvent.click(buttons[0])
    const options = screen.getAllByRole('option')
    fireEvent.click(options[0])
  })
})
