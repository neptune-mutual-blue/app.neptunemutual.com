import { CARDS_PER_PAGE } from '@/src/config/constants'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { testData } from '@/utils/unit-tests/test-data'
import {
  act,
  cleanup,
  render
} from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'

import { PoliciesExpiredPage } from '../PoliciesExpiredPage'

describe('PoliciesExpiredPage', () => {
  beforeEach(() => {
    mockHooksOrMethods.useValidReport()

    act(() => {
      i18n.activate('en')
    })
  })

  test('should render PoliciesExpiredPage loading page', () => {
    cleanup()

    mockHooksOrMethods.useExpiredPolicies(() => {
      return {
        data: testData.useExpiredPolicies.data,
        loading: true
      }
    })

    const { getAllByTestId, queryByTestId } = render(<PoliciesExpiredPage />)

    const ids = getAllByTestId('card-outline')
    expect(ids.length).toEqual(CARDS_PER_PAGE)

    const empty = queryByTestId('empty-text')

    expect(empty).not.toBeInTheDocument()
  })

  test('should render PoliciesExpiredPage placeholder text', () => {
    cleanup()

    mockHooksOrMethods.useExpiredPolicies(() => {
      return {
        data: {
          expiredPolicies: []
        },
        loading: false
      }
    })

    const { getByTestId } = render(<PoliciesExpiredPage />)

    const empty = getByTestId('empty-text')

    expect(empty).toBeInTheDocument()
  })

  test('it has Transaction List link', () => {
    cleanup()

    mockHooksOrMethods.useExpiredPolicies(() => {
      return {
        data: {
          expiredPolicies: []
        },
        loading: false
      }
    })

    const { getByRole } = render(<PoliciesExpiredPage />)

    const TransactionListLink = getByRole('link', {
      name: /Transaction List/i
    })

    expect(TransactionListLink).toHaveAttribute(
      'href',
      '/my-policies/transactions'
    )
  })

  test('Should have 1 card', () => {
    cleanup()

    mockHooksOrMethods.useCoversAndProducts2()
    mockHooksOrMethods.useExpiredPolicies()

    const { getAllByTestId } = render(<PoliciesExpiredPage />)

    const ids = getAllByTestId('policy-card')
    expect(ids.length).toEqual(1)
  })
})
