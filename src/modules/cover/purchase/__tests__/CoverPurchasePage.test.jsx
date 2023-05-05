import React from 'react'

import { act } from 'react-dom/test-utils'

import { CoverPurchaseDetailsPage } from '@/modules/cover/purchase/index.jsx'
import { mockFn } from '@/utils/unit-tests/test-mockup-fn'
import {
  fireEvent,
  render,
  screen,
  waitFor
} from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'

describe('CoverPurchasePage.test', () => {
  beforeEach(() => {
    act(() => {
      i18n.activate('en')
    })

    mockFn.useAppConstants()
    mockFn.useMyLiquidityInfo()
    // mockFn.useCoverOrProductData()
    // mockFn.useCoverStatsContext()
    // mockFn.useValidateReferralCode();
    mockFn.useRouter()

    render(<CoverPurchaseDetailsPage />)
  })

  test('should show purchase policy form after accepting rules', async () => {
    await waitFor(() => {
      expect(screen.getByTestId('accept-rules-check-box')).toBeInTheDocument()
    })

    const acceptRulesCheckbox = screen.getByTestId('accept-rules-check-box')
    const acceptRulesNextButton = screen.getByTestId(
      'accept-rules-next-button'
    )

    fireEvent.click(acceptRulesCheckbox)
    fireEvent.click(acceptRulesNextButton)

    expect(screen.getByTestId('purchase-policy-form')).toBeInTheDocument()
  })
})

describe('CoverPurchasePage.test', () => {
  beforeEach(() => {
    act(() => {
      i18n.activate('en')
    })

    mockFn.useAppConstants()
    mockFn.useMyLiquidityInfo()
    // mockFn.useCoverOrProductData(() => {})
    // mockFn.useCoverStatsContext()
    // mockFn.useValidateReferralCode();
    mockFn.useRouter()

    render(<CoverPurchaseDetailsPage />)
  })

  test('should show loading if not cover info', async () => {
    await waitFor(() => {
      expect(screen.getByText(/loading.../i)).toBeInTheDocument()
    })
  })
})
