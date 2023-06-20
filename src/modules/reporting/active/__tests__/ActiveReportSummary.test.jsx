import {
  ActiveReportSummary
} from '@/modules/reporting/active/ActiveReportSummary'
import { initiateTest } from '@/utils/unit-tests/helpers'
import { mockGlobals } from '@/utils/unit-tests/mock-globals'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { testData } from '@/utils/unit-tests/test-data'
import { screen } from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'

const refetchReport = jest.fn()
const refetchInfo = jest.fn()
const incidentReport = testData.incidentReports.data
const info = testData.consensusInfo.info

jest.mock('react-chartjs-2', () => {
  return {
    Doughnut: (p) => { return mockHooksOrMethods.chartMockFn(p) },
    Bar: (p) => { return mockHooksOrMethods.chartMockFn(p) }
  }
})

describe('ActiveReportSummary test', () => {
  const { initialRender, rerenderFn } = initiateTest(ActiveReportSummary, {
    refetchInfo: refetchInfo,
    refetchReport: refetchReport,
    incidentReport: incidentReport,
    resolvableTill: incidentReport.resolutionDeadline,
    yes: info.yes,
    no: info.no,
    myYes: info.myYes,
    myNo: info.myNo
  })

  beforeEach(() => {
    i18n.activate('en')
    mockHooksOrMethods.useRouter()
    mockHooksOrMethods.useAppConstants()
    mockGlobals.DOMRect()
    mockGlobals.resizeObserver()
    initialRender()
  })

  test("should render 'SearchAndSort bar", () => {
    const reportSummaryText = screen.getByText(/Report Summary/i)
    expect(reportSummaryText).toBeInTheDocument()
  })

  test('should do something if decision is null', () => {
    rerenderFn({
      refetchInfo: refetchInfo,
      refetchReport: refetchReport,
      incidentReport: { ...incidentReport, decision: null },
      resolvableTill: incidentReport.resolutionDeadline,
      yes: info.yes,
      no: info.no,
      myYes: info.myYes,
      myNo: info.myNo
    })
    const table = screen.getAllByRole('table')
    expect(table.length).toBe(2)
  })
})
