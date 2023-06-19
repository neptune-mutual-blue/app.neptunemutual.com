
import { act } from 'react-dom/test-utils'

import { StakingPage } from '@/modules/pools/staking'

import {
  fireEvent,
  screen,
  withDataProviders,
  withSorting
} from '@/utils/unit-tests/test-utils'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { initiateTest } from '@/utils/unit-tests/helpers'
import { testData } from '@/utils/unit-tests/test-data'

describe('Pool Staking', () => {
  const Component = withDataProviders(withSorting(StakingPage))
  const container = document.createElement('div')

  const { initialRender } = initiateTest(Component, {}, () => {
    mockHooksOrMethods.useAppConstants()
    mockHooksOrMethods.useSortableStats()
    mockHooksOrMethods.useTokenStakingPools()
    mockHooksOrMethods.usePoolInfo()
  })

  beforeEach(() => {
    initialRender()
  })

  const data = testData.tokenStakingPools.data

  describe('Staking card', () => {
    test('Correct number of cards should be shown', () => {
      const stakingCards = screen.getAllByTestId('staking-card')

      expect(stakingCards.length).toEqual(data.pools.length)
    })

    describe('TVL', () => {
      test('should be correct', () => {
        const tvls = screen.getAllByText('TVL')
        expect(tvls.length).toEqual(data.pools.length)
      })
    })

    describe('APR', () => {
      test('should be correct', () => {
        const aprs = screen.getAllByTestId('apr-badge')
        const receivedText = aprs[0].textContent
        const expectedText = 'APR: 0%'
        expect(receivedText).toEqual(expectedText)
      })
    })

    describe('Sorting', () => {
      test('Sorting is visible', () => {
        const sortButton = screen.getByTestId('select-button')
        const options = screen.queryByTestId('options-container')

        expect(options).not.toBeInTheDocument()

        act(() => {
          fireEvent.click(sortButton)
        })

        const options2 = screen.queryByTestId('options-container')
        expect(options2).toBeInTheDocument()
      })

      test('Sort Alphabetically', () => {
        const original = getValues(container, SELECTION.TITLE)

        const sortButton = container.querySelector('button')

        act(() => {
          fireEvent.select(sortButton)
        })

        const sortList = container.querySelector(
          `[aria-labelledby='${sortButton.id}']`
        )

        const [alphabet] = Array.from(sortList.querySelectorAll('li'))

        act(() => {
          fireEvent.click(alphabet)
        })

        const values = getValues(container, SELECTION.TITLE)

        expect(original).toEqual(values)
      })

      test('Sort by TVL', () => {
        const original = getValues(container, SELECTION.TVL)

        const sortButton = container.querySelector('button')

        act(() => {
          fireEvent.click(sortButton)
        })

        const sortList = container.querySelector(
          `[aria-labelledby='${sortButton.id}']`
        )

        const targetTvl = Array.from(sortList.querySelectorAll('li'))?.[1]

        act(() => {
          fireEvent.click(targetTvl)
        })

        const values = getValues(container, SELECTION.TVL)
        const sortedOriginal = [...original].sort(sortFromHighest)

        expect(original).not.toEqual(values)
        expect(sortedOriginal).toEqual(values)
      })

      test('Sort by APR', () => {
        const original = getValues(container, SELECTION.APR)

        const sortButton = container.querySelector('button')

        act(() => {
          fireEvent.click(sortButton)
        })

        const sortList = container.querySelector(
          `[aria-labelledby='${sortButton.id}']`
        )

        const target = Array.from(sortList.querySelectorAll('li'))?.[2]

        act(() => {
          fireEvent.click(target)
        })

        const values = getValues(container, SELECTION.APR)
        const sortedOriginal = [...original].sort(sortFromHighest)

        expect(original).not.toEqual(values)
        expect(sortedOriginal).toEqual(values)
      })
    })
  })
})

const SELECTION = {
  TITLE: 'title',
  TVL: 'tvl',
  APR: 'apr'
}

const select = (container, type) => {
  if (type === SELECTION.TITLE) {
    return Array.from(container.querySelectorAll('h4'))
  }

  if (type === SELECTION.TVL) {
    return Array.from(
      container.querySelectorAll('.text-right[title] p.text-7398C0')
    )
  }

  return Array.from(container.querySelectorAll('.text-21AD8C'))
}

const getValues = (container, type) => {
  if (type === SELECTION.TITLE) {
    return select(container, type).map((el) => { return el.textContent })
  }

  if (type === SELECTION.TVL) {
    return select(container, type).map((el) => { return parseFloat(el.textContent.slice(1)) }
    )
  }

  return select(container, type).map((el) => { return parseFloat(el.textContent.slice('APR: '.length)) }
  )
}

const sortFromHighest = (a, b) => {
  if (a === b) {
    return 0
  }

  return a > b ? -1 : 1
}
