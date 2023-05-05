import { PercentXStackedChart } from '@/common/PercentXStackedChart'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { testData } from '@/utils/unit-tests/test-data'
import { initiateTest } from '@/utils/unit-tests/helpers'
import { screen } from '@testing-library/react'

const props = testData.percentXStackedChart

jest.mock('react-chartjs-2', () => ({
  Bar: (p) => mockHooksOrMethods.chartMockFn(p)
}))

describe('Banner test', () => {
  const { initialRender } = initiateTest(
    PercentXStackedChart,
    props,
    () => {},
    { noProviders: true }
  )

  beforeEach(() => {
    initialRender()
  })

  test('should render the main component', () => {
    const wrapper = screen.getByTestId('percent-x-stacked-chart')
    expect(wrapper).toBeInTheDocument()
  })
})
