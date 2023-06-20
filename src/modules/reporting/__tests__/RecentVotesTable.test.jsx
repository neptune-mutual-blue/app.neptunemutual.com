import { RecentVotesTable } from '@/modules/reporting/RecentVotesTable'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { testData } from '@/utils/unit-tests/test-data'
import { render } from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'

jest.mock('react-chartjs-2', () => {
  return {
    Doughnut: (p) => { return mockHooksOrMethods.chartMockFn(p) },
    Bar: (p) => { return mockHooksOrMethods.chartMockFn(p) }
  }
})

describe('RecentVotesTable test', () => {
  beforeEach(() => {
    i18n.activate('en')
    mockHooksOrMethods.useRecentVotes()
  })

  const incidentReport = testData.incidentReports.data

  test('should render the recent votes table', () => {
    const screen = render(
      <RecentVotesTable
        coverKey={incidentReport.coverKey}
        productKey={incidentReport.productKey}
        incidentDate={incidentReport.incidentDate}
      />
    )
    const wrapper = screen.getByRole('table')
    const tableHeading = screen.getAllByText('Recent Votes')[0]
    expect(wrapper).toBeInTheDocument()
    expect(tableHeading).toBeInTheDocument()
  })
})
