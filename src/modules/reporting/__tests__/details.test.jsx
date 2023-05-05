import { ReportingDetailsPage } from '@/modules/reporting/details'
import { mockGlobals } from '@/utils/unit-tests/mock-globals'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { testData } from '@/utils/unit-tests/test-data'

import {
  render,
  screen
} from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'

jest.mock('react-chartjs-2', () => ({
  Doughnut: (p) => mockHooksOrMethods.chartMockFn(p),
  Bar: (p) => mockHooksOrMethods.chartMockFn(p)
}))

describe('ReportingDetailsPage test', () => {
  beforeEach(() => {
    i18n.activate('en')

    mockHooksOrMethods.useAppConstants()
    // mockHooksOrMethods.useCoverOrProductData()
    mockHooksOrMethods.useConsensusReportingInfo()
    mockHooksOrMethods.useRecentVotes()

    mockGlobals.resizeObserver()
    mockGlobals.DOMRect()
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
