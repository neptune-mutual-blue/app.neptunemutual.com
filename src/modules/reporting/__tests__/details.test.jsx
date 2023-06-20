import { ReportingDetailsPage } from '@/modules/reporting/details'
import { mockGlobals } from '@/utils/unit-tests/mock-globals'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { testData } from '@/utils/unit-tests/test-data'
import {
  render,
  screen
} from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'

jest.mock('react-chartjs-2', () => {
  return {
    Doughnut: (p) => { return mockHooksOrMethods.chartMockFn(p) },
    Bar: (p) => { return mockHooksOrMethods.chartMockFn(p) }
  }
})

const props = {
  coverKey: '0x676d782d76310000000000000000000000000000000000000000000000000000',
  productKey: '0x0000000000000000000000000000000000000000000000000000000000000000',
  projectOrProductName: 'GMX',
  reporterCommission: 1000,
  minReportingStake: '400000000000000000000',
  refetchCoverData: jest.fn,
  refetchReport: jest.fn,
  incidentReport: testData.incidentReports.data,
  coverOrProductData: testData.coversAndProducts2.data
}

describe('ReportingDetailsPage test', () => {
  beforeEach(() => {
    i18n.activate('en')

    mockHooksOrMethods.useAppConstants()
    mockHooksOrMethods.useConsensusReportingInfo()
    mockHooksOrMethods.useRecentVotes()

    mockGlobals.resizeObserver()
    mockGlobals.DOMRect()
  })

  test('should render the Reporting in breadcrumb', () => {
    render(
      <ReportingDetailsPage {...props} />
    )
    const wrapper = screen.getByText(/Reporting Period/i)
    expect(wrapper).toBeInTheDocument()
  })
})
