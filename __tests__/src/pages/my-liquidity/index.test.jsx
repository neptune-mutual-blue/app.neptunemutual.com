import { initiateTest } from '@/utils/unit-tests/helpers'
import { screen } from '@testing-library/react'
import MyLiquidity from '@/src/pages/my-liquidity/index'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'

jest.mock('@/common/Hero', () => ({
  Hero: () => {
    return <div data-testid='hero' />
  }
}))

jest.mock('@/modules/my-liquidity', () => ({
  MyLiquidityPage: () => {
    return <div data-testid='my-liquidity-page' />
  }
}))

describe('MyLiquidity test', () => {
  const { initialRender, rerenderFn } = initiateTest(MyLiquidity, {}, () => {
    mockHooksOrMethods.useCalculateLiquidity()
    mockHooksOrMethods.useCalculateTotalLiquidity()
    mockHooksOrMethods.useAppConstants()
    mockHooksOrMethods.useWeb3React()
    mockHooksOrMethods.useMyLiquidities()
  })

  beforeEach(() => {
    initialRender()
  })

  test('should display MyLiquidity with Hero and MyLiquidityPage component', () => {
    const hero = screen.getByTestId('hero')
    expect(hero).toBeInTheDocument()

    const myLiquidityPage = screen.getByTestId('my-liquidity-page')
    expect(myLiquidityPage).toBeInTheDocument()
  })

  test('Should display coming soon', () => {
    rerenderFn({ disabled: true })
    const comingSoon = screen.getByText('Coming soon!')
    expect(comingSoon).toBeInTheDocument()
  })
})
