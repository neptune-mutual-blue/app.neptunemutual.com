import { initiateTest } from '@/utils/unit-tests/helpers'
import { mockGlobals } from '@/utils/unit-tests/mock-globals'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { screen } from '@testing-library/react'

jest.mock('@/common/ComingSoon', () => ({
  ComingSoon: () => <div data-testid='coming-soon' />
}))

describe('ReportingNewCoverPage test', () => {
  const OLD_ENV = process.env
  beforeEach(() => {
    mockHooksOrMethods.useRouter()
    mockHooksOrMethods.useCoversAndProducts2()
    mockHooksOrMethods.getNetworkId()
    mockGlobals.fetch(true, undefined, { data: { incidentReport: [] } })
    process.env = { ...OLD_ENV, NEXT_PUBLIC_FEATURES: 'none' }
    const DisputeFormPage =
      require('@/src/pages/reports/[coverId]/incidents/[timestamp]/dispute').default

    const { initialRender } = initiateTest(DisputeFormPage)
    initialRender()
  })
  test('Should display coming soon', () => {
    const comingSoon = screen.getByTestId('coming-soon')
    expect(comingSoon).toBeInTheDocument()
  })
})
