import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import {
  initiateTest
} from '@/utils/unit-tests/helpers'
import { screen } from '@testing-library/react'

jest.mock('@/common/ComingSoon', () => ({
  ComingSoon: () => <div data-testid='coming-soon' />
}))

describe('DisputeFormPage test', () => {
  const OLD_ENV = process.env
  beforeEach(() => {
    process.env = { ...OLD_ENV, NEXT_PUBLIC_FEATURES: 'none' }
    const DisputeFormPage =
      require('@/src/pages/reports/[coverId]/products/[productId]/incidents/[timestamp]/dispute').default

    const { initialRender } = initiateTest(DisputeFormPage, {}, () => {
      // mockHooksOrMethods.useCoverOrProductData()
      mockHooksOrMethods.useFetchReport(() => ({
        data: { incidentReport: false },
        loading: true
      }))
    })
    initialRender()
  })

  test('Should display coming soon', () => {
    const comingSoon = screen.getByTestId('coming-soon')
    expect(comingSoon).toBeInTheDocument()
  })
})
