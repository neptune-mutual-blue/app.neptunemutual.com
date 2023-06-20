import { ProvideLiquidityToCover } from '@/modules/my-liquidity/details'
import { convertFromUnits } from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'
import { initiateTest } from '@/utils/unit-tests/helpers'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { testData } from '@/utils/unit-tests/test-data'
import { screen } from '@/utils/unit-tests/test-utils'

const initialMocks = () => {
  mockHooksOrMethods.useRouter()
  mockHooksOrMethods.useAppConstants()
  mockHooksOrMethods.useCoversAndProducts2()
  mockHooksOrMethods.useLiquidityFormsContext()
  mockHooksOrMethods.useCoverActiveReportings()
}

describe('MyLiquidityTxsTable test', () => {
  const { initialRender, rerenderFn } = initiateTest(
    ProvideLiquidityToCover,
    {
      coverKey: '0x6f6b780000000000000000000000000000000000000000000000000000000000'
    },
    initialMocks
  )

  beforeEach(() => {
    initialRender()
  })

  test('should render only `loading...` text if coverinfo not loaded', () => {
    rerenderFn({}, () => {
      mockHooksOrMethods.useCoversAndProducts2(() => { return { ...testData.coversAndProducts2, loading: true } })
    })
    const skeleton = screen.getByTestId('cover-liquidity-skeleton')
    expect(skeleton).toBeInTheDocument()
  })

  test('should render "No Data Found" when coverData is empty', () => {
    rerenderFn({}, () => {
      mockHooksOrMethods.useCoversAndProducts2(() => { return { ...testData.coversAndProducts2, getCoverByCoverKey: () => { return null } } })
    })

    expect(screen.getByText('No Data Found')).toBeInTheDocument()
  })

  test('should render the main container if coverinfo loaded', () => {
    const wrapper = screen.getByTestId('main-container')
    expect(wrapper).toBeInTheDocument()
  })

  test('should render the breadcrumbs component', () => {
    const wrapper = screen.getByTestId('breadcrumbs')
    expect(wrapper).toBeInTheDocument()
  })

  test('should not render the diversified profile info for dedicated cover', () => {
    const wrapper = screen.queryByTestId(
      'diversified-coverprofileinfo-container'
    )
    expect(wrapper).not.toBeInTheDocument()
  })

  test('should render diversified cover profile if supports products', () => {
    rerenderFn({}, () => {
      mockHooksOrMethods.useCoversAndProducts2(() => {
        return {
          ...testData.coversAndProducts2,
          getCoverByCoverKey: () => { return { ...testData.coversAndProducts2.data, supportsProducts: true } }
        }
      })
    })
    const wrapper = screen.getByTestId('diversified-coverprofileinfo-container')
    expect(wrapper).toBeInTheDocument()
  })

  test('should render the herostat container', () => {
    const wrapper = screen.getByTestId('herostat')
    expect(wrapper).toBeInTheDocument()
  })

  test('Herostat container should have correct description', () => {
    const wrapper = screen.getByTestId('herostat')
    const desc = wrapper.querySelector('p')

    const text = formatCurrency(
      convertFromUnits(
        testData.liquidityFormsContext.info.myUnrealizedShare,
        testData.appConstants.liquidityTokenDecimals
      ),
      testData.router.locale
    ).long
    expect(desc).toHaveTextContent(text)
  })

  test('should not render CoverProduct component for dedicated cover', () => {
    const wrapper = screen.queryByTestId('cover-product-container')
    expect(wrapper).not.toBeInTheDocument()
  })

  test('should render the SeeMore container', () => {
    const wrapper = screen.getByTestId('see-more-container')
    expect(wrapper).toBeInTheDocument()
  })

  test('should render the ProvideLiquidity form component', () => {
    const wrapper = screen.getByTestId('provide-liquidity-container')
    expect(wrapper).toBeInTheDocument()
  })

  test('should render the LiquidityResolution component', () => {
    const wrapper = screen.getByTestId('liquidity-resolution-container')
    expect(wrapper).toBeInTheDocument()
  })
})
