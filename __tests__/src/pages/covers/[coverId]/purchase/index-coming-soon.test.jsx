import { mockFn } from '@/utils/unit-tests/test-mockup-fn'
import { render, screen } from '@testing-library/react'

jest.mock('@/common/ComingSoon', () => ({
  ComingSoon: () => <div data-testid='coming-soon' />
}))

describe('CoverPurchaseDetails test', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    mockFn.useRouter()
    process.env = { ...OLD_ENV, NEXT_PUBLIC_FEATURES: 'none' }

    const CoverPurchaseDetails =
      require('@/src/pages/covers/[coverId]/purchase/index').default
    render(<CoverPurchaseDetails />)
  })

  test('coming soon', () => {
    const comingSoon = screen.getByTestId('coming-soon')
    expect(comingSoon).toBeInTheDocument()
  })
})
