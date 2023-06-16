import React from 'react'

import { CoverOptionsPage } from '@/modules/cover/CoverOptionsPage'
import { actions as coverActions } from '@/src/config/cover/actions'
import { createMockRouter } from '@/utils/unit-tests/createMockRouter'
import { testData } from '@/utils/unit-tests/test-data'
import {
  fireEvent,
  render,
  screen,
  waitFor,
  withProviders
} from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'

const NUMBER_OF_ACTIONS = Object.keys(coverActions).length

describe('CoverOptionsPage', () => {
  const backBtnHandler = jest.fn()
  beforeEach(async () => {
    i18n.activate('en')

    const router = createMockRouter({
      query: { coverId: 'animated-brands' },
      back: () => { return backBtnHandler() }
    })
    const Component = withProviders(CoverOptionsPage, router, {
      coverProductInfo: testData.coverInfo
    })
    render(<Component />)
  })

  test('has correct number cover actions', async () => {
    const coverOptionActions = await waitFor(() => { return screen.getAllByTestId('cover-option-actions') }
    )
    expect(coverOptionActions).toHaveLength(NUMBER_OF_ACTIONS)
  })

  test('should call router.back when clicking on back button ', () => {
    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[buttons.length - 1])

    expect(backBtnHandler).toHaveBeenCalled()
  })
})

describe('CoverOptionsPage', () => {
  beforeEach(async () => {
    i18n.activate('en')
    // mockHooksOrMethods.useCoverOrProductData(() => {})

    const router = createMockRouter({
      query: { coverId: 'animated-brands' }
    })
    const Component = withProviders(CoverOptionsPage, router)
    render(<Component />)
  })

  test('returns loading if not cover info', async () => {
    const loading = screen.getByText(/loading.../i)

    expect(loading).toBeInTheDocument()
  })
})
