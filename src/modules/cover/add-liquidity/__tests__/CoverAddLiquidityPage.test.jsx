import React from 'react'

import { CoverAddLiquidityDetailsPage } from '@/modules/cover/add-liquidity'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { testData } from '@/utils/unit-tests/test-data'
import {
  act,
  fireEvent,
  render,
  waitFor
} from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'

jest.mock('next/link', () => {
  return ({ children }) => {
    return children
  }
})

describe('CoverAddLiquidityPage.test', () => {
  beforeAll(async () => {
    act(() => {
      i18n.activate('en')
    })
  })

  test('should show add liquidity form after accepting rules', async () => {
    mockHooksOrMethods.useCoversAndProducts2(() => {
      return {
        ...testData.coversAndProducts2,
        getCoverByCoverKey: () => { return { ...testData.coversAndProducts2.getCoverByCoverKey(), productStatus: 0 } }
      }
    })
    const { getByTestId } = render(<CoverAddLiquidityDetailsPage />)

    await waitFor(() => {
      expect(getByTestId('accept-rules-check-box')).toBeInTheDocument()
    })

    const acceptRulesCheckbox = getByTestId('accept-rules-check-box')
    const acceptRulesNextButton = getByTestId('accept-rules-next-button')

    fireEvent.click(acceptRulesCheckbox)
    fireEvent.click(acceptRulesNextButton)

    expect(getByTestId('add-liquidity-form')).toBeInTheDocument()
  })

  test('should show loading skeleton when loading ', async () => {
    mockHooksOrMethods.useCoversAndProducts2(() => {
      return {
        ...testData.coversAndProducts2,
        loading: true
      }
    })

    const { queryByTestId } = render(<CoverAddLiquidityDetailsPage />)

    await waitFor(() => {
      expect(queryByTestId('liquidity-section-skeleton')).toBeInTheDocument()
    })
  })

  test('should show "No Data Found" when cover data is null', async () => {
    mockHooksOrMethods.useCoversAndProducts2(() => {
      return {
        ...testData.coversAndProducts2,
        getCoverByCoverKey: () => { return null }
      }
    })

    const { queryByText } = render(<CoverAddLiquidityDetailsPage />)

    await waitFor(() => {
      expect(queryByText(/No Data Found/)).toBeInTheDocument()
    })
  })
})
