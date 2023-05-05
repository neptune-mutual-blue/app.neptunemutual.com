import React from 'react'

import { act } from 'react-dom/test-utils'

import { CoverPurchaseDetailsPage } from '@/modules/cover/purchase/index.jsx'
import {
  fireEvent,
  render,
  screen,
  waitFor
} from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'

describe('CoverPurchasePage.test', () => {
  beforeEach(() => {
    act(() => {
      i18n.activate('en')
    })

    mockHooksOrMethods.useAppConstants()
    mockHooksOrMethods.useMyLiquidityInfo()
    // mockHooksOrMethods.useCoverOrProductData()
    // mockHooksOrMethods.useCoverStatsContext()
    // mockHooksOrMethods.useValidateReferralCode();
    mockHooksOrMethods.useRouter()

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

    mockHooksOrMethods.useAppConstants()
    mockHooksOrMethods.useMyLiquidityInfo()
    // mockHooksOrMethods.useCoverOrProductData(() => {})
    // mockHooksOrMethods.useCoverStatsContext()
    // mockHooksOrMethods.useValidateReferralCode();
    mockHooksOrMethods.useRouter()

    render(<CoverPurchaseDetailsPage />)
  })

  test('should show loading if not cover info', async () => {
    await waitFor(() => {
      expect(screen.getByText(/loading.../i)).toBeInTheDocument()
    })
  })
})
