import { i18n } from '@lingui/core'
import { render, screen } from '@/utils/unit-tests/test-utils'
import { PoolsTabs } from '@/modules/pools/PoolsTabs'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'

describe('PoolsTab test', () => {
  beforeEach(() => {
    i18n.activate('en')

    mockHooksOrMethods.useAppConstants()
  })

  test('should render the title correctly', () => {
    render(<PoolsTabs active='pod-staking' />)
    const wrapper = screen.getByText(/Bond and Staking Pools/i)
    expect(wrapper).toBeInTheDocument()
  })
})
