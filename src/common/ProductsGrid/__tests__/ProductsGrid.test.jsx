import { ProductsGrid } from '@/common/ProductsGrid/ProductsGrid'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import {
  render,
  screen,
  waitFor,
  withProviders
} from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'

describe('ProductsGrid', () => {
  beforeEach(async () => {
    i18n.activate('en')
    mockHooksOrMethods.useCoversAndProducts2()

    const Component = withProviders(ProductsGrid)
    render(<Component />)
  })

  test('has correct title', async () => {
    const backBtn = await waitFor(() => { return screen.getByText(/Back/i) })
    expect(backBtn).toBeInTheDocument()
  })
})
