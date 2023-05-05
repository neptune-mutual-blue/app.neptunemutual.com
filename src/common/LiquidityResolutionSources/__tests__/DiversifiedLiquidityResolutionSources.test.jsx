import {
  DiversifiedLiquidityResolutionSources
} from '@/common/LiquidityResolutionSources/DiversifiedLiquidityResolutionSources'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { testData } from '@/utils/unit-tests/test-data'
import {
  initiateTest
} from '@/utils/unit-tests/helpers'
import { screen } from '@testing-library/react'

describe('DiversifiedLiquidityResolutionSources component', () => {
  const { initialRender } = initiateTest(
    DiversifiedLiquidityResolutionSources,
    {
      info: testData.liquidityFormsContext.info,
      children: <p>Here is the children</p>
    },
    () => {
      mockHooksOrMethods.useRouter()
      mockHooksOrMethods.useAppConstants()
      // mockHooksOrMethods.useCoverStatsContext()
    }
  )
  beforeEach(() => {
    initialRender()
  })

  test('should render total liquidity', () => {
    const text = screen.getByText(/Total Liquidity/i)
    expect(text).toBeInTheDocument()
  })

  test('should render the children passsed to it', () => {
    const text = screen.getByText(/Here is the children/i)
    expect(text).toBeInTheDocument()
  })
})
