import { ClaimDetailsPage } from '@/modules/my-policies/ClaimDetailsPage'
import { convertFromUnits } from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { testData } from '@/utils/unit-tests/test-data'
import {
  initiateTest
} from '@/utils/unit-tests/helpers'
import { screen } from '@testing-library/react'

describe('Claim Details Page loading', () => {
  beforeEach(() => {
    mockHooksOrMethods.useRouter(() => ({
      ...testData.router,
      query: {
        coverId: 'defi',
        productId: '1inch'
      },
      locale: 'en'
    }))
    // mockHooksOrMethods.useCoverOrProductData(() => null)
    mockHooksOrMethods.useActivePoliciesByCover()
    mockHooksOrMethods.useFetchReportsByKeyAndDate()
    mockHooksOrMethods.useAppConstants()

    const { initialRender } = initiateTest(ClaimDetailsPage, {})

    initialRender()
  })

  test('should render the loading indicator', () => {
    const loadingText = screen.getByText('loading...')
    expect(loadingText).toBeInTheDocument()
  })
})

describe('Claim Details Page disabled', () => {
  beforeEach(() => {
    mockHooksOrMethods.useRouter(() => ({
      ...testData.router,
      query: {
        coverId: 'defi',
        productId: '1inch'
      },
      locale: 'en'
    }))
    // mockHooksOrMethods.useCoverOrProductData()
    mockHooksOrMethods.useActivePoliciesByCover()
    mockHooksOrMethods.useFetchReportsByKeyAndDate()
    mockHooksOrMethods.useAppConstants()

    const { initialRender } = initiateTest(ClaimDetailsPage, {
      disabled: true
    })

    initialRender()
  })

  test('should render the coming soon indicator', () => {
    const comingSoonText = screen.getByText('Coming soon!')
    expect(comingSoonText).toBeInTheDocument()
  })
})

describe('Claim Details Page', () => {
  beforeEach(() => {
    mockHooksOrMethods.useRouter(() => ({
      ...testData.router,
      query: {
        coverId: 'defi',
        productId: '1inch'
      },
      locale: 'en'
    }))
    // mockHooksOrMethods.useCoverOrProductData()
    mockHooksOrMethods.useActivePoliciesByCover()
    mockHooksOrMethods.useFetchReportsByKeyAndDate()
    mockHooksOrMethods.useAppConstants()

    const { initialRender } = initiateTest(ClaimDetailsPage, {})

    initialRender()
  })

  const activeProtection = formatCurrency(
    convertFromUnits(testData.activePoliciesByCover.totalActiveProtection, 6),
    'en',
    'USD'
  ).long

  test('should render the coming soon indicator', () => {
    const protectionAmount = screen.getByText(activeProtection)
    expect(protectionAmount).toBeInTheDocument()
  })
})
