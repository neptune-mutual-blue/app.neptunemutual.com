import { initiateTest } from '@/utils/unit-tests/helpers'
import { screen } from '@testing-library/react'
import { ReportingActivePage } from '@/modules/reporting/active/active'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'

describe('Active Reporting Page Data Loading', () => {
  beforeEach(() => {
    mockHooksOrMethods.useRouter()
    mockHooksOrMethods.useActiveReportings(() => ({
      data: { incidentReports: [] },
      loading: true,
      hasMore: false
    }))

    const { initialRender } = initiateTest(ReportingActivePage, {})

    initialRender()
  })

  test('Should render the page card skeleton', () => {
    const cardSkeleton = screen.getByTestId('active-reportings-card-skeleton')

    expect(cardSkeleton).toBeInTheDocument()
  })
})

describe('Active Reporting Page Data Display', () => {
  beforeEach(() => {
    mockHooksOrMethods.useRouter()
    mockHooksOrMethods.useActiveReportings()

    const { initialRender } = initiateTest(ReportingActivePage, {})

    initialRender()
  })

  test('should render the page grid', () => {
    const cardGrid = screen.getByTestId('active-page-grid')

    expect(cardGrid).toBeInTheDocument()
  })

  test('should render the has more button', () => {
    const hasMoreButton = screen.getByTestId('has-more-button')

    expect(hasMoreButton).toBeInTheDocument()
  })
})

describe('Active Reporting Page No Data Display', () => {
  beforeEach(() => {
    mockHooksOrMethods.useRouter()
    mockHooksOrMethods.useActiveReportings(() => ({
      data: { incidentReports: [] },
      loading: false,
      hasMore: false
    }))
    mockHooksOrMethods.useFlattenedCoverProducts()

    const { initialRender } = initiateTest(ReportingActivePage, {})

    initialRender()
  })

  test('should render the empty reportings component', () => {
    const emptyItemsDisplay = screen.getByTestId('active-reporting-empty')

    expect(emptyItemsDisplay).toBeInTheDocument()
  })
})
