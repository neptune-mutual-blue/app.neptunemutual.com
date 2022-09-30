import { mockFn } from '@/utils/unit-tests/test-mockup-fn'
import { render, screen } from '@testing-library/react'

jest.mock('@/common/ComingSoon', () => ({
  ComingSoon: () => <div data-testid='coming-soon' />
}))

describe('Options test', () => {
  const OLD_ENV = process.env
  beforeEach(() => {
    mockFn.useRouter()
    process.env = { ...OLD_ENV, NEXT_PUBLIC_ENABLE_V2: 'false' }
    const Options =
      require('@/src/pages/covers/[coverId]/products/[productId]').default
    render(<Options />)
  })

  test('Should display coming soon', () => {
    const comingSoon = screen.getByTestId('coming-soon')
    expect(comingSoon).toBeInTheDocument()
  })
})
