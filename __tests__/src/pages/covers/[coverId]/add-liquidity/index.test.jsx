import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { screen, render } from '@testing-library/react'

jest.mock('@/src/modules/cover/add-liquidity', () => ({
  CoverAddLiquidityDetailsPage: () => (
    <div data-testid='cover-add-liquidity-details-page' />
  )
}))

describe('CoverAddLiquidityDetails test', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    mockHooksOrMethods.useRouter()
    process.env = { ...OLD_ENV, NEXT_PUBLIC_FEATURES: 'liquidity' }

    const CoverPurchaseDetails =
      require('@/src/pages/covers/[coverId]/add-liquidity/index').default
    render(<CoverPurchaseDetails />)
  })

  test('Should display incident report page', () => {
    const newIncidentReportPage = screen.getByTestId(
      'cover-add-liquidity-details-page'
    )
    expect(newIncidentReportPage).toBeInTheDocument()
  })
})
