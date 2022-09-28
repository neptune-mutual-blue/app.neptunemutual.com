/* eslint-disable no-loss-of-precision */
import { screen, act, render } from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'
import { HomeCard } from '@/common/HomeCard/HomeCard'
import { formatCurrency } from '@/utils/formatter/currency'
import { convertFromUnits } from '@/utils/bn'

describe('alert component behaviour', () => {
  const heroData = {
    covered: formatCurrency(
      convertFromUnits(1641223163089707363984731).toString(),
      'en'
    ).short,
    coverFee: formatCurrency(
      convertFromUnits(31051517279213969040659).toString(),
      'en'
    ).short
  }

  const items = [
    {
      name: 'Covered',
      amount: heroData.covered
    },
    {
      name: 'Cover Fee',
      amount: heroData.coverFee
    }
  ]

  beforeAll(() => {
    act(() => {
      i18n.activate('en')
    })
  })

  test('should render card component', () => {
    render(<HomeCard items={items} />)
    const covered = screen.getByText(items[0].name)
    const coverFee = screen.getByText(items[1].name)
    const coveredValue = screen.getByText(items[0].amount)
    const coverFeeValue = screen.getByText(items[1].amount)
    expect(covered).toBeInTheDocument()
    expect(coverFee).toBeInTheDocument()
    expect(coveredValue).toBeInTheDocument()
    expect(coverFeeValue).toBeInTheDocument()
  })
})
