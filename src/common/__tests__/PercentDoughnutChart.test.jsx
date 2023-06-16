import { PercentDoughnutChart } from '@/common/PercentDoughnutChart'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { testData } from '@/utils/unit-tests/test-data'
import { initiateTest } from '@/utils/unit-tests/helpers'
import { screen } from '@testing-library/react'

jest.mock('react-chartjs-2', () => {
  return {
    Doughnut: (p) => { return mockHooksOrMethods.chartMockFn(p) }
  }
})

const props = testData.doughnutChart
describe('Banner test', () => {
  const { initialRender } = initiateTest(PercentDoughnutChart, props)

  beforeEach(() => {
    initialRender()
  })

  test('should render the main component', () => {
    const wrapper = screen.getByTestId('percent-doughnut-chart')
    expect(wrapper).toBeInTheDocument()
  })
})
