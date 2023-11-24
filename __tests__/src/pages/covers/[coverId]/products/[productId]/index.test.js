import { initiateTest } from '@/utils/unit-tests/helpers'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { testData } from '@/utils/unit-tests/test-data'
import { screen } from '@testing-library/react'

jest.mock('@/src/modules/cover/CoverOptionsPage', () => {
  return {
    CoverOptionsPage: () => {
      return <div data-testid='cover-options-page' />
    }
  }
})

describe('Options test', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV, NEXT_PUBLIC_ENABLE_V2: 'true' }
    const Index =
      require('@/src/pages/covers/[coverId]/products/[productId]').default
    const { initialRender } = initiateTest(Index, {}, () => {
      mockHooksOrMethods.useRouter()
      mockHooksOrMethods.useCoversAndProducts2(() => { return { ...testData.coversAndProducts2, getProduct: (...args) => { return (true) }, loading: false } })
    })
    initialRender()
  })

  test('should display BreadCrumbs of Animated Brands and cover option page', () => {
    const coverOptionPage = screen.getByTestId('cover-options-page')
    expect(coverOptionPage).toBeInTheDocument()
  })
})
