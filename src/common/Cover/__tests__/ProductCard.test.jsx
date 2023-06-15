import { ProductCard } from '@/common/Cover/ProductCard'
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
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen
} from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'

const mockCoverDetails = testData.coversAndProducts2.data

const getUtilizationRatio = (totalLiquidity, activeCommitment) => {
  const liquidity = totalLiquidity
  const protection = activeCommitment
  const utilization = toBN(liquidity).isEqualTo(0)
    ? '0'
    : toBN(protection).dividedBy(liquidity).decimalPlaces(2).toString()

  return formatPercent(utilization, 'en')
}

describe('ProductCard component', () => {
  beforeEach(() => {
    mockHooksOrMethods.useAppConstants()
    mockHooksOrMethods.useRouter()

    const { initialRender } = initiateTest(ProductCard, {
      coverKey: mockCoverDetails.coverKey,
      productKey: mockCoverDetails.productKey,
      productData: mockCoverDetails
    })

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
      const img = screen.getByTestId('cover-img')
      expect(img).toHaveAttribute('alt', mockCoverDetails.projectName)
    })

    test('should have correct image src', () => {
      const imgSrc = getCoverImgSrc({
        key: mockCoverDetails.productKey
      })
      const img = screen.getByTestId('cover-img')
      expect(img).toHaveAttribute('src', imgSrc)
    })

    test('should show empty cover image in case of error', () => {
      const img = screen.getByTestId('cover-img')
      fireEvent.error(img, { target: img })
      expect(img).toHaveAttribute('src', '/images/covers/empty.svg')
    })
  })

  describe('cover badge', () => {
    beforeEach(() => {
      act(() => {
        i18n.activate('en')
      })
    })
    test("should render card status badge 'Incident Occurred'", () => {
      const badgeText = screen.queryByText('Incident Occurred')

      expect(badgeText).toBeInTheDocument()
    })

    test("should not render card status badge for 'Normal' status", () => {
      cleanup()

      render(
        <ProductCard
          coverKey={mockCoverDetails.coverKey}
          productKey={mockCoverDetails.productKey}
          productData={{ ...mockCoverDetails, productStatus: 0 }}
        />
      )

      expect(screen.queryByTestId('card-badge')).not.toBeInTheDocument()
    })
  })

  test('should render correct project name', () => {
    const projectName = screen.getByTestId('project-name').textContent
    expect(`${projectName}`).toEqual(mockCoverDetails.productInfoDetails.productName)
  })

  test('should render correct annual cover fee text', () => {
    const coverFeeEl = screen.getByTestId('cover-fee')
    const coverFee = `Annual Cover fee: ${formatPercent(
      toBN(mockCoverDetails.floor).dividedBy(MULTIPLIER),
      'en'
    )}-${formatPercent(
      toBN(mockCoverDetails.ceiling).dividedBy(MULTIPLIER),
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
        convertFromUnits(
          mockCoverDetails.commitment,
          testData.appConstants.liquidityTokenDecimals
        ).toString(),
        'en'
      ).short
      expect(protectionEl).toHaveTextContent(liquidityText)
    })

    test('should have correct title text', () => {
      const protectionEl = screen.getByTestId('protection')
      const titleText = formatCurrency(
        convertFromUnits(
          mockCoverDetails.commitment,
          testData.appConstants.liquidityTokenDecimals
        ).toString(),
        'en'
      ).long
      expect(protectionEl).toHaveAttribute('title', titleText)
    })
  })

  describe('Liquidity', () => {
    test('should render correct liquidity text', () => {
      const liquidityEl = screen.getByTestId('liquidity')

      const liquidityText = formatCurrency(
        convertFromUnits(mockCoverDetails.capacity, testData.appConstants.liquidityTokenDecimals).toString(),
        'en'
      ).short

      expect(liquidityEl).toHaveTextContent(liquidityText)
    })

    test('should have correct title text', () => {
      const liquidityEl = screen.getByTestId('liquidity')

      const titleText = formatCurrency(
        convertFromUnits(mockCoverDetails.capacity, testData.appConstants.liquidityTokenDecimals).toString(),
        'en'
      ).long

      expect(liquidityEl).toHaveAttribute('title', titleText)
    })
  })
})
