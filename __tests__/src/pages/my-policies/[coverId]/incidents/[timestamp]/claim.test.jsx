import { isFeatureEnabled } from '@/src/config/environment'
import ClaimPolicyDedicatedCover
  from '@/src/pages/my-policies/[coverId]/incidents/[timestamp]/claim'
import { initiateTest } from '@/utils/unit-tests/helpers'
import { screen } from '@testing-library/react'

const mock = jest.spyOn({ isFeatureEnabled }, 'isFeatureEnabled')

jest.mock('@/modules/my-policies/ClaimDetailsPage', () => {
  return {
    ClaimDetailsPage: ({ disabled }) => {
      return (
        <div data-testid='claim-details-page'>{disabled && 'Coming soon!'}</div>
      )
    }
  }
})

describe('ClaimPolicyDedicatedCover test', () => {
  const { initialRender, rerenderFn } = initiateTest(
    ClaimPolicyDedicatedCover,
    {},
    () => {
      mock.mockImplementation(() => true)
    }
  )

  beforeEach(() => {
    initialRender()
  })

  test('should display ClaimPolicyDedicatedCover component', () => {
    const policies = screen.getByTestId('claim-details-page')
    expect(policies).toBeInTheDocument()
  })
})
