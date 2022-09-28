import { i18n } from '@lingui/core'
import { render, screen } from '@/utils/unit-tests/test-utils'
import { globalFn, mockFn } from '@/utils/unit-tests/test-mockup-fn'
import { testData } from '@/utils/unit-tests/test-data'
import { ReportingDetailsPage } from '@/modules/reporting/details'

jest.mock('react-chartjs-2', () => ({
  Doughnut: (p) => mockFn.chartMockFn(p),
  Bar: (p) => mockFn.chartMockFn(p)
}))

describe('ReportingDetailsPage test', () => {
  beforeEach(() => {
    i18n.activate('en')

    mockFn.useAppConstants()
    mockFn.useCoverOrProductData()
    mockFn.useConsensusReportingInfo()
    mockFn.useRecentVotes()

    globalFn.resizeObserver()
    globalFn.DOMRect()
  })

  const refetch = jest.fn()

  test('should render the Reporting in breadcrumb', () => {
    render(
      <ReportingDetailsPage
        incidentReport={testData.incidentReports.data.incidentReport}
        refetchReport={refetch}
      />
    )
    const wrapper = screen.getByText(/Reporting Period/i)
    expect(wrapper).toBeInTheDocument()
  })
})
