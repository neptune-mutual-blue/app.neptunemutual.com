import { initiateTest } from '@/utils/unit-tests/test-mockup-fn'
import { screen } from '@testing-library/react'
import MyLiquidityCover from '@/pages/my-liquidity/[coverId]/index'

jest.mock('@/src/modules/my-liquidity/details', () => ({
  ProvideLiquidityToCover: () => {
    return <div data-testid='provide-liquidity-to-cover' />
  }
}))

describe('MyLiquidityCover test', () => {
  const { initialRender } = initiateTest(MyLiquidityCover)

  beforeEach(() => {
    initialRender()
  })

  test('should display MyLiquidityCoverPage component', () => {
    const coverPage = screen.getByTestId('provide-liquidity-to-cover')
    expect(coverPage).toBeInTheDocument()
  })
})
