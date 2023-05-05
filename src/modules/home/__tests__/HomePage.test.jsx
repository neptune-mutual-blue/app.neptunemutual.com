import { initiateTest } from '@/utils/unit-tests/helpers'
import HomePage from '@/modules/home/index'
import { screen } from '@testing-library/react'
import { i18n } from '@lingui/core'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'

describe('Home Page', () => {
  beforeEach(() => {
    i18n.activate('en')

    mockHooksOrMethods.useFetchHeroStats()
    mockHooksOrMethods.useAppConstants()
    mockHooksOrMethods.useProtocolDayData()

    mockHooksOrMethods.useCovers()
    mockHooksOrMethods.useFlattenedCoverProducts()
    mockHooksOrMethods.useSortableStats()

    const { initialRender } = initiateTest(HomePage, {})

    initialRender()
  })

  test('should render the liquidity chart wrapper', () => {
    const liquidityChartWrapper = screen.getByTestId('liquidity-chart-wrapper')
    expect(liquidityChartWrapper).toBeInTheDocument()
  })

  test('should render the available covers container', () => {
    const availableCoversContainer = screen.getByTestId(
      'available-covers-container'
    )
    expect(availableCoversContainer).toBeInTheDocument()
  })
})
