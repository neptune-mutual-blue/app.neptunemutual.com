import {
  DiversifiedLiquidityResolutionSources
} from '@/common/LiquidityResolutionSources/DiversifiedLiquidityResolutionSources'
import { initiateTest } from '@/utils/unit-tests/helpers'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { testData } from '@/utils/unit-tests/test-data'
import { screen } from '@testing-library/react'

describe('DiversifiedLiquidityResolutionSources component', () => {
  const { initialRender } = initiateTest(
    DiversifiedLiquidityResolutionSources,
    {
      coverData: testData.coversAndProducts2.data,
      children: <p>Here is the children</p>
    },
    () => {
      mockHooksOrMethods.useRouter()
      mockHooksOrMethods.useAppConstants()
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
