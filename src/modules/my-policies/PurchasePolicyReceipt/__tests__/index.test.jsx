import {
  PurchasePolicyReceipt
} from '@/modules/my-policies/PurchasePolicyReceipt'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import {
  render,
  screen
} from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'

describe('PurchasePolicyReceipt test', () => {
  beforeEach(() => {
    i18n.activate('en')

    mockHooksOrMethods.useCoversAndProducts2()
    mockHooksOrMethods.useAppConstants()
    mockHooksOrMethods.useNetwork()
    mockHooksOrMethods.useRegisterToken()
    mockHooksOrMethods.useFetchCoverPurchasedEvent()
  })

  test('should render the title correctly', () => {
    render(
      <PurchasePolicyReceipt
        txHash='0x3e19c6f2398efdf5f6183a168bb694421ebd5aab367eed39872a293b26a71a7c'
      />
    )
    const wrapper = screen.getByText(/Policy Receipt/i)
    expect(wrapper).toBeInTheDocument()
  })

  test('should not show anything if txhash is not passed', () => {
    render(<PurchasePolicyReceipt />)

    const titleText = screen.queryByText(/Policy Receipt/i)
    expect(titleText).toBeNull()
  })
})
