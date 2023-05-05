import {
  initiateTest,
  mockFn
} from '@/utils/unit-tests/test-mockup-fn'
import { screen } from '@testing-library/react'

jest.mock('@/src/modules/cover/CoverOptionsPage', () => ({
  CoverOptionsPage: () => {
    return <div data-testid='cover-options-page' />
  }
}))

describe('Options test', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV, NEXT_PUBLIC_ENABLE_V2: 'true' }
    const Index =
      require('@/src/pages/covers/[coverId]/products/[productId]').default
    const { initialRender } = initiateTest(Index, {}, () => {
      mockFn.useRouter()
      // mockFn.useCoverOrProductData()
    })
    initialRender()
  })

  test('should display BreadCrumbs of Animated Brands and cover option page', () => {
    const coverOptionPage = screen.getByTestId('cover-options-page')
    expect(coverOptionPage).toBeInTheDocument()
  })
})
