import { mockFn } from '@/utils/unit-tests/test-mockup-fn'
import { render, screen } from '@testing-library/react'

jest.mock('@/src/modules/cover/purchase', () => ({
  CoverPurchaseDetailsPage: () => (
    <div data-testid='cover-purchase-details-page' />
  )
}))

describe('CoverPurchaseDetails test', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    mockFn.useRouter()
    process.env = { ...OLD_ENV, NEXT_PUBLIC_FEATURES: 'policy' }

    const CoverPurchaseDetails =
      require('@/src/pages/covers/[coverId]/purchase/index').default
    render(<CoverPurchaseDetails />)
  })

  test('Should display Cover Purchase Details Page component', () => {
    const newIncidentReportPage = screen.getByTestId(
      'cover-purchase-details-page'
    )
    expect(newIncidentReportPage).toBeInTheDocument()
  })
})
