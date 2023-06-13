import MyPoliciesExpired from '@/src/pages/my-policies/expired'
import { initiateTest } from '@/utils/unit-tests/helpers'
import { screen } from '@testing-library/react'

jest.mock('@/src/modules/my-policies/PoliciesTabs', () => {
  return {
    PoliciesTabs: ({ children }) => {
      return (
        <div data-testid='policies-tabs'>
          {children}
        </div>
      )
    }
  }
})

jest.mock('@/src/modules/my-policies/expired/PoliciesExpiredPage', () => {
  return {
    PoliciesExpiredPage: () => {
      return <div data-testid='policies-expired-page' />
    }
  }
})

describe('MyPoliciesExpired test', () => {
  const { initialRender, rerenderFn } = initiateTest(MyPoliciesExpired)

  beforeEach(() => {
    initialRender()
  })

  test('should display MyPoliciesExpired and PoliciesTabs component', () => {
    const tabs = screen.getByTestId('policies-tabs')
    expect(tabs).toBeInTheDocument()

    const policies = screen.getByTestId('policies-expired-page')
    expect(policies).toBeInTheDocument()
  })

  test('Should display coming soon', () => {
    rerenderFn({ disabled: true })
    const comingSoon = screen.getByText('Coming soon!')
    expect(comingSoon).toBeInTheDocument()
  })
})
