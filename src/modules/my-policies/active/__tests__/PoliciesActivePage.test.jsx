import { CARDS_PER_PAGE } from '@/src/config/constants'
import { initiateTest } from '@/utils/unit-tests/helpers'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { testData } from '@/utils/unit-tests/test-data'
import {
  act,
  screen
} from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'

import { PoliciesActivePage } from '../PoliciesActivePage'

describe('PoliciesActivePage', () => {
  const { initialRender, rerenderFn } = initiateTest(PoliciesActivePage, {}, () => {
    mockHooksOrMethods.useCoversAndProducts2(() => {
      return {
        data: [],
        loading: true
      }
    })
  })

  beforeEach(() => {
    mockHooksOrMethods.useValidReport()
    initialRender()

    act(() => {
      i18n.activate('en')
    })
  })

  test('should render main container by default', () => {
    const container = screen.getByTestId('main-container')
    expect(container).toBeInTheDocument()
  })

  test('should render PoliciesActivePage loading page', () => {
    const ids = screen.getAllByTestId('card-outline')
    expect(ids.length).toEqual(CARDS_PER_PAGE)

    const empty = screen.queryByTestId('empty-text')

    expect(empty).not.toBeInTheDocument()
  })

  test('should render PoliciesActivePage placeholder text', () => {
    rerenderFn({
      data: []
    }, () => {
      mockHooksOrMethods.useCoversAndProducts2(() => {
        return {
          ...testData.coversAndProducts2,
          loading: false
        }
      })
    })

    const empty = screen.getByTestId('empty-text')

    expect(empty).toBeInTheDocument()
  })

  test('it has Transaction List link', () => {
    const TransactionListLink = screen.getByRole('link', {
      name: /Transaction List/i
    })

    expect(TransactionListLink).toHaveAttribute(
      'href',
      '/my-policies/transactions'
    )
  })

  test('Should have 2 cards', () => {
    rerenderFn({
      data: testData.activePolicies.data.activePolicies
    }, () => {
      mockHooksOrMethods.useCoversAndProducts2(() => {
        return {
          ...testData.coversAndProducts2,
          loading: false
        }
      })
    })

    const ids = screen.getAllByTestId('card-outline')
    expect(ids.length).toEqual(2)
  })
})
