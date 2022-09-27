import { render, act } from '@/utils/unit-tests/test-utils'
import { PoliciesActivePage } from '../PoliciesActivePage'
import { i18n } from '@lingui/core'
import { testData } from '@/utils/unit-tests/test-data'
import { mockFn } from '@/utils/unit-tests/test-mockup-fn'

describe('PoliciesActivePage', () => {
  beforeEach(() => {
    mockFn.useValidReport()

    act(() => {
      i18n.activate('en')
    })
  })

  test('should render PoliciesActivePage loading page', () => {
    const { getAllByTestId, queryByTestId } = render(
      <PoliciesActivePage data={[]} loading />
    )

    const ids = getAllByTestId('card-outline')
    expect(ids.length).toEqual(6)

    const empty = queryByTestId('empty-text')

    expect(empty).not.toBeInTheDocument()
  })

  test('should render PoliciesActivePage placeholder text', () => {
    const { getByTestId } = render(
      <PoliciesActivePage data={[]} loading={false} />
    )

    const empty = getByTestId('empty-text')

    expect(empty).toBeInTheDocument()
  })

  test('it has Transaction List link', () => {
    const { getByRole } = render(
      <PoliciesActivePage data={[]} loading />
    )

    const TransactionListLink = getByRole('link', {
      name: /Transaction List/i
    })

    expect(TransactionListLink).toHaveAttribute(
      'href',
      '/my-policies/transactions'
    )
  })

  test('Should have 2 cards', () => {
    const { getAllByTestId } = render(
      <PoliciesActivePage
        data={testData.activePolicies.data.activePolicies}
        loading={false}
      />
    )

    const ids = getAllByTestId('card-outline')
    expect(ids.length).toEqual(2)
  })
})
