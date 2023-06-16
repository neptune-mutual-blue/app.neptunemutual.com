import { CoverCard } from '@/common/Cover/CoverCard'
import { MULTIPLIER } from '@/src/config/constants'
import { getCoverImgSrc } from '@/src/helpers/cover'
import {
  convertFromUnits,
  toBN
} from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'
import { formatPercent } from '@/utils/formatter/percent'
import { initiateTest } from '@/utils/unit-tests/helpers'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { testData } from '@/utils/unit-tests/test-data'
import { screen } from '@/utils/unit-tests/test-utils'

const { data } = testData.coversAndProducts2

const getUtilizationRatio = (totalLiquidity, activeCommitment) => {
  const liquidity = totalLiquidity
  const protection = activeCommitment
  const utilization = toBN(liquidity).isEqualTo(0)
    ? '0'
    : toBN(protection).dividedBy(liquidity).decimalPlaces(2).toString()

  return formatPercent(utilization, 'en')
}

describe('CoverCard component', () => {
  const { initialRender, rerenderFn } = initiateTest(CoverCard, {
    coverKey: data.coverKey,
    coverData: data
  },
  () => {
    mockHooksOrMethods.useAppConstants()
    mockHooksOrMethods.useRouter()
  })

  beforeEach(() => {
    initialRender()
  })

  test('should render the outer OutlinedCard', () => {
    const wrapper = screen.getByTestId('card-outline')
    expect(wrapper).toBeInTheDocument()
  })

  describe('cover image', () => {
    test('should render cover image without fail', () => {
      const img = screen.getByTestId('cover-img')
      expect(img).toBeInTheDocument()
    })

    test('should have correct image alt text', () => {
      mockHooksOrMethods.useCoversAndProducts2()

      const img = screen.getByTestId('cover-img')
      expect(img).toHaveAttribute('alt', data.coverInfoDetails.coverName)
    })

    test('should have correct image src', () => {
      const imgSrc = getCoverImgSrc({ key: data.coverKey })
      const img = screen.getByTestId('cover-img')
      expect(img).toHaveAttribute('src', imgSrc)
    })
  })

  describe('cover badge', () => {
    test("should render card status badge 'Incident Occurred'", () => {
      const badgeText = screen.queryByText('Incident Occurred')

      expect(badgeText).toBeInTheDocument()
    })

    test("should not render card status badge for 'Normal' status", () => {
      rerenderFn({
        coverData: { ...data, productStatus: 0 }
      })

      expect(screen.queryByTestId('card-badge')).not.toBeInTheDocument()
    })
  })

  test('should render correct project name', () => {
    const projectName = screen.getByTestId('project-name')
    expect(projectName.textContent).toEqual(data.coverInfoDetails.coverName)
  })

  test('should render correct cover fee text', () => {
    const coverFeeEl = screen.getByTestId('cover-fee')
    const coverFee = `Annual Cover fee: ${formatPercent(
      toBN(data.floor).dividedBy(MULTIPLIER),
      'en'
    )}-${formatPercent(
      toBN(data.ceiling).dividedBy(MULTIPLIER),
      'en'
    )}`

    expect(coverFeeEl).toHaveTextContent(coverFee)
  })

  test('should render correct utilization ratio', () => {
    const utilizationRatio = getUtilizationRatio(
      testData.liquidityFormsContext.info.totalLiquidity,
      testData.coverStats.info.activeCommitment
    )
    const utilizationEl = screen.getByTestId('util-ratio')
    expect(utilizationEl).toHaveTextContent(utilizationRatio)
  })

  describe('Protection', () => {
    test('should render correct protection text', () => {
      const protectionEl = screen.getByTestId('protection')

      const liquidityText = formatCurrency(
        convertFromUnits(data.commitment, testData.appConstants.liquidityTokenDecimals).toString(),
        'en'
      ).short

      expect(protectionEl).toHaveTextContent(liquidityText)
    })

    test('should have correct title text', () => {
      const protectionEl = screen.getByTestId('protection')
      const titleText = formatCurrency(
        convertFromUnits(data.commitment, testData.appConstants.liquidityTokenDecimals).toString(),
        'en'
      ).long

      expect(protectionEl.parentElement).toHaveAttribute('title', titleText)
    })
  })

  describe('Liquidity', () => {
    test('should render correct liquidity text', () => {
      const liquidityEl = screen.getByTestId('liquidity')

      const liquidityText = formatCurrency(
        convertFromUnits(data.capacity, testData.appConstants.liquidityTokenDecimals).toString(),
        'en'
      ).short

      expect(liquidityEl).toHaveTextContent(liquidityText)
    })

    test('should have correct title text', () => {
      const liquidityEl = screen.getByTestId('liquidity')

      const titleText = formatCurrency(
        convertFromUnits(data.capacity, testData.appConstants.liquidityTokenDecimals).toString(),
        'en'
      ).long

      expect(liquidityEl).toHaveAttribute('title', titleText)
    })
  })
})
