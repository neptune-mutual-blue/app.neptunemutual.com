import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { initiateTest } from '@/utils/unit-tests/helpers'
import { screen } from '@testing-library/react'

jest.mock('@/common/ComingSoon', () => ({
  ComingSoon: () => <div data-testid='coming-soon' />
}))

describe('MyLiquidityCover test', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    mockHooksOrMethods.useRouter()
    process.env = { ...OLD_ENV, NEXT_PUBLIC_FEATURES: 'none' }
    const MyLiquidityCover =
      require('@/pages/my-liquidity/[coverId]/index').default
    const { initialRender } = initiateTest(MyLiquidityCover)
    initialRender()
  })

  test('Should display coming soon', () => {
    const comingSoon = screen.getByTestId('coming-soon')
    expect(comingSoon).toBeInTheDocument()
  })
})
