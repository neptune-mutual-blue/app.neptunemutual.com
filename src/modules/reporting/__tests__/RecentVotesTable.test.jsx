import { i18n } from '@lingui/core'
import { render } from '@/utils/unit-tests/test-utils'
import { testData } from '@/utils/unit-tests/test-data'
import { RecentVotesTable } from '@/modules/reporting/RecentVotesTable'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'

jest.mock('react-chartjs-2', () => ({
  Doughnut: (p) => mockHooksOrMethods.chartMockFn(p),
  Bar: (p) => mockHooksOrMethods.chartMockFn(p)
}))

describe('RecentVotesTable test', () => {
  beforeEach(() => {
    i18n.activate('en')
    mockHooksOrMethods.useRecentVotes()
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
