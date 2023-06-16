import { initiateTest } from '@/utils/unit-tests/helpers'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { screen } from '@testing-library/react'

jest.mock('@/common/ComingSoon', () => ({
  ComingSoon: () => <div data-testid='coming-soon' />
}))

describe('CoverPurchaseDetails test', () => {
  const OLD_ENV = process.env
  beforeEach(() => {
    mockHooksOrMethods.useRouter()
    process.env = { ...OLD_ENV, NEXT_PUBLIC_FEATURES: 'false' }
    const CoverPurchaseDetails =
      require('@/src/pages/covers/[coverId]/products/[productId]/purchase').default
    const { initialRender } = initiateTest(CoverPurchaseDetails)
    initialRender()
  })

  test('Should display coming soon', () => {
    const comingSoon = screen.getByTestId('coming-soon')
    expect(comingSoon).toBeInTheDocument()
  })
})
