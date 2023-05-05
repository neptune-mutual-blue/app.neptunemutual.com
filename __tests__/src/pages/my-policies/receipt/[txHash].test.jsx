import { initiateTest } from '@/utils/unit-tests/helpers'
import PurchasePolicyReceiptPage from '@/src/pages/my-policies/receipt/[txHash]'
import { screen } from '@testing-library/react'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'

jest.mock('@/modules/my-policies/PurchasePolicyReceipt', () => {
  return {
    PurchasePolicyReceipt: ({ txHash }) => {
      return <div data-testid='purchase-policy-receipt'>{txHash}</div>
    }
  }
})

describe('PurchasePolicyReceiptPage test', () => {
  const { initialRender } = initiateTest(PurchasePolicyReceiptPage, {}, () => {
    mockHooksOrMethods.useRouter(() => ({
      query: { txHash: 'test-txHash' }
    }))
  })

  beforeEach(() => {
    initialRender()
  })

  test('should display PurchasePolicyReceiptPage component', () => {
    const policies = screen.getByTestId('purchase-policy-receipt')
    expect(policies).toBeInTheDocument()

    const text = screen.getByText('test-txHash')
    expect(text).toBeInTheDocument()
  })
})
