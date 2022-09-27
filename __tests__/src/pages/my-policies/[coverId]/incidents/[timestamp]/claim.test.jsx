import { initiateTest } from '@/utils/unit-tests/test-mockup-fn'
import ClaimPolicyDedicatedCover from '@/src/pages/my-policies/[coverId]/incidents/[timestamp]/claim'
import { screen } from '@testing-library/react'

import * as environment from '@/src/config/environment'
const mock = jest.spyOn(environment, 'isFeatureEnabled')

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
