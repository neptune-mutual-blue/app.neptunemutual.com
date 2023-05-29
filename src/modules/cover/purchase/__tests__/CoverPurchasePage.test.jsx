import React from 'react'

import { act } from 'react-dom/test-utils'

import { CoverPurchaseDetailsPage } from '@/modules/cover/purchase/index.jsx'
import {
  render,
  screen,
  waitFor
} from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { testData } from '@/utils/unit-tests/test-data'
import { initiateTest } from '@/utils/unit-tests/helpers'

describe('CoverPurchasePage.test', () => {
  const { initialRender, rerenderFn } = initiateTest(CoverPurchaseDetailsPage, {}, () => {
    mockHooksOrMethods.useCoversAndProducts2()
  })

  beforeEach(() => {
    initialRender()
  })

  test('should render the breadcrumb component', () => {
    expect(screen.getByTestId('cover-purchase-breadcrumb')).toBeInTheDocument()
  })

  test('should show purchase policy form if status is normal', async () => {
    rerenderFn({}, () => {
      mockHooksOrMethods.useCoversAndProducts2(() => ({
        ...testData.coversAndProducts2,
        getCoverByCoverKey: () => ({ ...testData.coversAndProducts2.getCoverByCoverKey(), productStatus: 0 })
      }))
    })

    expect(screen.getByTestId('purchase-policy-form-container')).toBeInTheDocument()
  })
})

describe('CoverPurchasePage.test', () => {
  beforeEach(() => {
    act(() => {
      i18n.activate('en')
    })

    render(<CoverPurchaseDetailsPage />)
  })

  test('should show loading if not cover info', async () => {
    mockHooksOrMethods.useCoversAndProducts2(() => ({
      ...testData.coversAndProducts2,
      loading: true
    }))
    render(<CoverPurchaseDetailsPage />)

    await waitFor(() => {
      expect(screen.getByTestId('purchase-policy-skeleton')).toBeInTheDocument()
    })
  })
})
