import { initiateTest, mockFn } from '@/utils/unit-tests/test-mockup-fn'
import { screen } from '@testing-library/react'
import { testData } from '@/utils/unit-tests/test-data'
import * as environment from '@/src/config/environment'

const mockIsV2BasketCoverEnabled = jest.spyOn(
  environment,
  'isV2BasketCoverEnabled'
)

jest.mock('@/common/ComingSoon', () => ({
  ComingSoon: () => {
    return <div data-testid='coming-soon' />
  }
}))

describe('Options test', () => {
  mockIsV2BasketCoverEnabled.mockImplementation(() => false)
  const CoverPage = require('@/src/pages/covers/[coverId]').default

  const { initialRender } = initiateTest(CoverPage, {}, () => {
    mockFn.useCoverOrProductData(() => {
      return { ...testData.coverInfo, supportsProducts: true }
    })
  })

  beforeEach(() => {
    initialRender()
  })

  test('Should display Coming Soon', () => {
    mockIsV2BasketCoverEnabled.mockImplementation(() => false)
    const CoverPage = require('@/src/pages/covers/[coverId]').default

    initiateTest(CoverPage)

    const comingSoon = screen.getByTestId('coming-soon')
    expect(comingSoon).toBeInTheDocument()
  })
})
