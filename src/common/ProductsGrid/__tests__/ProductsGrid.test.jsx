import {
  screen,
  render,
  withProviders,
  waitFor
} from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'
import { ProductsGrid } from '@/common/ProductsGrid/ProductsGrid'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'

describe('ProductsGrid', () => {
  beforeEach(async () => {
    i18n.activate('en')
    mockHooksOrMethods.useCoverOrProductData()

    const Component = withProviders(ProductsGrid)
    render(<Component />)
  })

  test('has correct title', async () => {
    const backBtn = await waitFor(() => screen.getByText(/Back/i))
    expect(backBtn).toBeInTheDocument()
  })
})
