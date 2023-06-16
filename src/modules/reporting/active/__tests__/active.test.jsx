import { ReportingActivePage } from '@/modules/reporting/active/active'
import { initiateTest } from '@/utils/unit-tests/helpers'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { testData } from '@/utils/unit-tests/test-data'
import {
  fireEvent,
  screen
} from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'

describe('ReportingActivePage test', () => {
  const { initialRender, rerenderFn } = initiateTest(ReportingActivePage)

  beforeEach(() => {
    i18n.activate('en')
    mockHooksOrMethods.useNetwork()

    mockHooksOrMethods.useActiveReportings({
      data: testData.reporting.activeReporting
    })
    mockHooksOrMethods.useRouter()
    mockHooksOrMethods.useCoversAndProducts2()
    // mockHooksOrMethods.useFetchCoverStats()
    initialRender()
  })

  test("should render 'SearchAndSort bar", () => {
    const searchBar = screen.getByTestId('search-and-sort-container')
    expect(searchBar).toBeInTheDocument()
  })

  test('should render card skeletons if loading', () => {
    rerenderFn({}, () => {
      mockHooksOrMethods.useActiveReportings({
        data: { incidentReports: [] },
        loading: true
      })
    })

    const loadingSkeleton = screen.getByTestId(
      'active-reportings-card-skeleton'
    )
    expect(loadingSkeleton).toBeInTheDocument()
  })

  test('should render cards lists', () => {
    rerenderFn({}, () => {
      mockHooksOrMethods.useActiveReportings()
    })

    const gridList = screen.getByTestId('active-page-grid')
    expect(gridList).toBeInTheDocument()
  })

  test('should set searchValue on search box change', () => {
    const input = screen.getByTestId('search-input')
    fireEvent.change(input, { target: { value: 'Anim' } })
  })
})
