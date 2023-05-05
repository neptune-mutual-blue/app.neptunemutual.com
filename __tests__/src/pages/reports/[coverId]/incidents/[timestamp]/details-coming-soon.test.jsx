import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { initiateTest } from '@/utils/unit-tests/helpers'
import { screen } from '@testing-library/react'

jest.mock('@/common/ComingSoon', () => ({
  ComingSoon: () => <div data-testid='coming-soon' />
}))

describe('IncidentResolvedCoverPage test', () => {
  const OLD_ENV = process.env
  beforeEach(() => {
    mockHooksOrMethods.useRouter()
    process.env = { ...OLD_ENV, NEXT_PUBLIC_FEATURES: 'none' }
    const IncidentResolvedCoverPage =
      require('@/src/pages/reports/[coverId]/incidents/[timestamp]/details').default
    const { initialRender } = initiateTest(
      IncidentResolvedCoverPage,
      {},
      () => {
        mockHooksOrMethods.useFetchReport(() => ({
          data: false,
          loading: true
        }))
      }
    )
    initialRender()
  })

  test('Should display coming soon', () => {
    const comingSoon = screen.getByTestId('coming-soon')
    expect(comingSoon).toBeInTheDocument()
  })
})
