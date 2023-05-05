import { initiateTest } from '@/utils/unit-tests/helpers'
import ClaimPolicyDiversifiedProduct from '@/pages/my-policies/[coverId]/products/[productId]/incidents/[timestamp]/claim'
import { screen } from '@testing-library/react'

jest.mock('@/modules/my-policies/ClaimDetailsPage', () => {
  return {
    ClaimDetailsPage: ({ disabled }) => {
      return (
        <div data-testid='claim-details-page'>{disabled && 'Coming soon!'}</div>
      )
    }
  }
})

describe('ClaimPolicyDiversifiedProduct test', () => {
  const { initialRender } = initiateTest(ClaimPolicyDiversifiedProduct)

  beforeEach(() => {
    initialRender()
  })

  test('should display ClaimPolicyDiversifiedProduct component', () => {
    const policies = screen.getByTestId('claim-details-page')
    expect(policies).toBeInTheDocument()
  })
})
