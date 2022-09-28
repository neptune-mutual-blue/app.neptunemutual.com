import { i18n } from '@lingui/core'
import { render } from '@/utils/unit-tests/test-utils'
import { testData } from '@/utils/unit-tests/test-data'
import { RecentVotesTable } from '@/modules/reporting/RecentVotesTable'
import { mockFn } from '@/utils/unit-tests/test-mockup-fn'

jest.mock('react-chartjs-2', () => ({
  Doughnut: (p) => mockFn.chartMockFn(p),
  Bar: (p) => mockFn.chartMockFn(p)
}))

describe('RecentVotesTable test', () => {
  beforeEach(() => {
    i18n.activate('en')
    mockFn.useRecentVotes()
  })

  const incidentReport = testData.incidentReports.data.incidentReport

  test('should render the recent votes table', () => {
    const screen = render(
      <RecentVotesTable
        coverKey={incidentReport.coverKey}
        productKey={incidentReport.productKey}
        incidentDate={incidentReport.incidentDate}
      />
    )
    const wrapper = screen.getByRole('table')
    const tableHeading = screen.getByText('Recent Votes')
    expect(wrapper).toBeInTheDocument()
    expect(tableHeading).toBeInTheDocument()
  })
})
