import { initiateTest, mockFn } from '@/utils/unit-tests/test-mockup-fn'
import { screen } from '@testing-library/react'

jest.mock('@/common/ComingSoon', () => ({
  ComingSoon: () => <div data-testid='coming-soon' />
}))

describe('NewIncidentReportPage test', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    mockFn.useRouter()
    process.env = { ...OLD_ENV, NEXT_PUBLIC_FEATURES: 'none' }
    const NewIncidentReportPage =
      require('@/src/pages/covers/[coverId]/new-report/index').default
    const { initialRender } = initiateTest(NewIncidentReportPage)
    initialRender()
  })

  test('Should display coming soon', () => {
    const comingSoon = screen.getByTestId('coming-soon')
    expect(comingSoon).toBeInTheDocument()
  })
})
