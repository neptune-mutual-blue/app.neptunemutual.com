import {
  VotesSummaryHorizontalChart
} from '@/modules/reporting/VotesSummaryHorizontalChart'
import { convertFromUnits } from '@/utils/bn'
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
    Bar: (p) => { return mockHooksOrMethods.chartMockFn(p) }
  }
})

describe('VotesSummaryHorizontalChart test', () => {
  beforeEach(() => {
    i18n.activate('en')

    HTMLCanvasElement.prototype.getContext = jest.fn()
    mockGlobals.resizeObserver()
    mockGlobals.DOMRect()

    const incidentReport = testData.incidentReports.data

    const isAttestedWon = incidentReport.decision
    const yesPercent = '43%'
    const noPercent = '57%'

    const votes = {
      yes: convertFromUnits(testData.consensusInfo.info.yes)
        .decimalPlaces(0)
        .toNumber(),
      no: convertFromUnits(testData.consensusInfo.info.yes)
        .decimalPlaces(0)
        .toNumber()
    }

    const majority = {
      voteCount: isAttestedWon
        ? incidentReport.totalAttestedCount
        : incidentReport.totalRefutedCount,
      stake: isAttestedWon ? votes.yes : votes.no,
      percent: isAttestedWon ? yesPercent : noPercent,
      variant: isAttestedWon ? 'success' : 'failure'
    }

    render(
      <VotesSummaryHorizontalChart
        yesPercent={yesPercent}
        noPercent={noPercent}
        showTooltip={incidentReport.resolved}
        majority={majority}
      />
    )
  })

  test('should render the charts', async () => {
    const canvas = screen.getAllByTestId('horizontal-chart')
    expect(canvas.length).toBe(2)
  })
})
