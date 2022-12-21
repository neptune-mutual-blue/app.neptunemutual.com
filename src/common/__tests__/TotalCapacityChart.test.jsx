import { TotalCapacityChart } from '@/common/TotalCapacityChart'
import { testData } from '@/utils/unit-tests/test-data'
// import { testData } from "@/utils/unit-tests/test-data";
import { initiateTest, mockFn } from '@/utils/unit-tests/test-mockup-fn'
import { screen } from '@testing-library/react'

describe('TotalCapacityChart', () => {
  const { initialRender, rerenderFn } = initiateTest(
    TotalCapacityChart,
    {},
    () => {
      mockFn.useAppConstants()
      mockFn.useProtocolDayData()
      mockFn.useRouter()
    }
  )

  beforeEach(() => {
    initialRender()
  })

  test('should render the main wrapper', () => {
    const wrapper = screen.getByTestId('total-liquidity-chart')
    expect(wrapper).toBeInTheDocument()
  })

  test('simulating with no data', () => {
    rerenderFn({})
    const wrapper = screen.getByTestId('total-liquidity-chart')
    expect(wrapper).toBeInTheDocument()
  })

  test('simulating with 1 data points', () => {
    mockFn.setTimeout()
    rerenderFn({ data: testData.protocolDayData.data.slice(0, 3) })
    const wrapper = screen.getByTestId('total-liquidity-chart')
    expect(wrapper).toBeInTheDocument()
  })
})
