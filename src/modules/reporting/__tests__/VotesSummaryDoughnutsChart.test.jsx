import { i18n } from '@lingui/core'
import { render, screen } from '@/utils/unit-tests/test-utils'
import { testData } from '@/utils/unit-tests/test-data'
import { convertFromUnits } from '@/utils/bn'
import { VotesSummaryDoughnutChart } from '@/modules/reporting/VotesSummaryDoughnutCharts'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { mockGlobals } from '@/utils/unit-tests/mock-globals'

jest.mock('react-chartjs-2', () => {
  return {
    Doughnut: (p) => { return mockHooksOrMethods.chartMockFn(p) }
  }
})

describe('VotesSummaryDoughnutChart test', () => {
  beforeEach(() => {
    i18n.activate('en')
    mockHooksOrMethods.useRouter()

    HTMLCanvasElement.prototype.getContext = jest.fn()

    mockGlobals.resizeObserver()
    mockGlobals.DOMRect()

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

    render(
      <VotesSummaryDoughnutChart
        yesPercent={yesPercent}
        noPercent={noPercent}
        votes={votes}
      />
    )
  })

  test('should render doughnut chart', async () => {
    const canvas = await screen.getByTestId('doughnut-charts')
    expect(canvas).toBeInTheDocument()
  })
})
