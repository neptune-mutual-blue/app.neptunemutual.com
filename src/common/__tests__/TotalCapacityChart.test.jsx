import { TotalCapacityChart } from '@/common/TotalCapacityChart'
// import { testData } from "@/utils/unit-tests/test-data";
import { initiateTest } from '@/utils/unit-tests/helpers'
import { mockGlobals } from '@/utils/unit-tests/mock-globals'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { testData } from '@/utils/unit-tests/test-data'
import { screen } from '@testing-library/react'

describe('TotalCapacityChart', () => {
  const { initialRender, rerenderFn } = initiateTest(
    TotalCapacityChart,
    {},
    () => {
      mockHooksOrMethods.useAppConstants()
      mockHooksOrMethods.useProtocolDayData()
      mockHooksOrMethods.useRouter()
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
    mockGlobals.setTimeout()
    rerenderFn({ data: testData.protocolDayData.data.totalCapacity.slice(0, 3) })
    const wrapper = screen.getByTestId('total-liquidity-chart')
    expect(wrapper).toBeInTheDocument()
  })
})
