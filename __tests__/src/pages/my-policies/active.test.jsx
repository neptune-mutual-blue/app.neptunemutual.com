import MyPoliciesActive from '@/src/pages/my-policies/active'
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

jest.mock('@/src/modules/my-policies/active/PoliciesActivePage', () => {
  return {
    PoliciesActivePage: () => {
      return <div data-testid='policies-active-page' />
    }
  }
})

describe('MyPoliciesActive test', () => {
  const { initialRender, rerenderFn } = initiateTest(MyPoliciesActive)

  beforeEach(() => {
    initialRender()
  })

  test('should display MyPoliciesActive and PoliciesTabs component', () => {
    const tabs = screen.getByTestId('policies-tabs')
    expect(tabs).toBeInTheDocument()

    const policies = screen.getByTestId('policies-active-page')
    expect(policies).toBeInTheDocument()
  })

  test('Should display coming soon', () => {
    rerenderFn({ disabled: true })
    const comingSoon = screen.getByText('Coming soon!')
    expect(comingSoon).toBeInTheDocument()
  })
})
