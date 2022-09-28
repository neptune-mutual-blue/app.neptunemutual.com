import { SearchAndSortBar } from '@/common/SearchAndSortBar'
import { testData } from '@/utils/unit-tests/test-data'
import { initiateTest } from '@/utils/unit-tests/test-mockup-fn'
import { screen } from '@testing-library/react'

describe('SearchAndSortBar component', () => {
  const { initialRender } = initiateTest(
    SearchAndSortBar,
    testData.searchAndSortProps
  )
  beforeEach(() => {
    initialRender()
  })

  test('should render the main container without fail', () => {
    const wrapper = screen.getByTestId('search-and-sort-container')
    expect(wrapper).toBeInTheDocument()
  })

  test('should render the search input', () => {
    const input = screen.getByTestId('search-input')
    expect(input).toBeInTheDocument()
  })

  test('should render the Search Icon', () => {
    const icon = screen.getByTestId('search-icon')
    expect(icon).toBeInTheDocument()
  })

  test('should render the Select container', () => {
    const select = screen.getByTestId('select-container')
    expect(select).toBeInTheDocument()
  })
})
