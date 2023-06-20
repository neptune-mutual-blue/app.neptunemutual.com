import React from 'react'

import { HomeHero } from '@/modules/home/Hero'
import * as ProtocolHook from '@/src/hooks/useProtocolDayData'
import { toBN } from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'
import { formatPercent } from '@/utils/formatter/percent'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { testData } from '@/utils/unit-tests/test-data'
import {
  act,
  cleanup,
  render,
  screen
} from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'

const mockFunction = (file, method, returnData) => {
  jest.spyOn(file, method).mockImplementation(() => { return returnData })
}

const getChangeData = (totalCapacity) => {
  if (totalCapacity && totalCapacity.length >= 2) {
    const lastSecond = toBN(totalCapacity[totalCapacity.length - 2].value)
    const last = toBN(totalCapacity[totalCapacity.length - 1].value)

    const diff =
      lastSecond.isGreaterThan(0) &&
      last.minus(lastSecond).dividedBy(lastSecond)

    return {
      last: last.toString(),
      diff: diff && diff.absoluteValue().toString(),
      rise: diff && diff.isGreaterThanOrEqualTo(0)
    }
  } else if (totalCapacity && totalCapacity.length === 1) {
    return {
      last: toBN(totalCapacity[0].value).toString(),
      diff: null,
      rise: false
    }
  }
}

describe('Hero test', () => {
  const renderer = () => {
    act(() => {
      i18n.activate('en')
    })
    render(<HomeHero />)
  }

  beforeEach(() => {
    i18n.activate('en')

    mockHooksOrMethods.useProtocolDayData()
    mockHooksOrMethods.useRouter()
    mockHooksOrMethods.useFetchHeroStats()

    render(<HomeHero />)
  })

  test('should render the component correctly', () => {
    const wrapper = screen.getByTestId('hero-container')
    expect(wrapper).toBeInTheDocument()
  })

  test('should render TVL info `HomeCard` component', () => {
    const wrapper = screen.getByTestId('tvl-homecard')
    expect(wrapper).toBeInTheDocument()
  })

  test('should render available & reporting info `HomeMainCard` component', () => {
    const wrapper = screen.getByTestId('homemaincard')
    expect(wrapper).toBeInTheDocument()
  })

  test('should have element with `Total Capacity` text', () => {
    const text = 'Total Capacity'
    const wrapper = screen.getByText(text)
    expect(wrapper).toBeInTheDocument()
  })

  test('should render correct total capacity value', () => {
    const changeData = getChangeData(testData.protocolDayData.data.totalCapacity)
    const currencyText = formatCurrency(
      changeData?.last || '0',
      'en'
    ).short

    const wrapper = screen.getByTestId('changedata-currency')
    expect(wrapper).toHaveTextContent(currencyText)
  })

  test('should render total capacity info', () => {
    const wrapper = screen.getByTestId('changedata-percent')
    expect(wrapper).toBeInTheDocument()
  })

  test('should render correct change percentage', () => {
    const changeData = getChangeData(testData.protocolDayData.data.totalCapacity)
    const percentText = formatPercent(changeData.diff, 'en')
    const wrapper = screen
      .getByTestId('changedata-percent')
      .querySelector('span:nth-child(2)')
    expect(wrapper).toHaveTextContent(percentText)
  })

  test('should render TotalLiquidityChart component', () => {
    const wrapper = screen.getByTestId('capacity-chart-wrapper')
    expect(wrapper).toBeInTheDocument()
  })

  test('should have class `text-DC2121` and `transform-flip` if changedata.rise is false', () => {
    cleanup()
    mockFunction(ProtocolHook, 'useProtocolDayData', {
      data: {
        totalCapacity: [
          {
            date: 1649980800,
            value: '42972266000000000000000000'
          },
          {
            date: 1650067200,
            value: '13002586813333333333333335'
          }
        ]
      },
      loading: false
    })
    renderer()

    const wrapper = screen.getByTestId('changedata-percent')
    expect(wrapper).toHaveClass('text-DC2121')
    expect(wrapper.querySelector('span>svg')).toHaveClass('transform-flip')
  })

  test('should not render the percent data if data lenght is 1', () => {
    cleanup()
    mockFunction(ProtocolHook, 'useProtocolDayData', {
      data: {
        totalCapacity: [
          {
            date: 1649980800,
            value: '42972266000000000000000000'
          }
        ]
      },
      loading: false
    })
    renderer()

    const wrapper = screen.queryByTestId('changedata-percent')
    expect(wrapper).toBeNull()
  })
})
