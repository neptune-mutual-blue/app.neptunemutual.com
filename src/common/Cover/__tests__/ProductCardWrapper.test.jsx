import { ProductCardWrapper } from '@/common/Cover/ProductCardWrapper'
import { initiateTest } from '@/utils/unit-tests/helpers'
import { testData } from '@/utils/unit-tests/test-data'
import { screen } from '@/utils/unit-tests/test-utils'

const data = testData.coversAndProducts2.data

describe('ProductCardWrapper component', () => {
  const { initialRender, rerenderFn } = initiateTest(ProductCardWrapper, {
    coverKey: data.coverKey,
    productKey: data.productKey,
    productData: data
  })

  beforeEach(() => {
    initialRender()
  })

  test('should render the card skeleton if productInfo is null', () => {
    rerenderFn({
      productData: null
    })

    const wrapper = screen.getByTestId('card-status-badge')
    expect(wrapper).toBeInTheDocument()
  })

  test('should not render the link to verify its the skeleton', () => {
    rerenderFn({
      productData: null
    })

    const linkElement = screen.queryByTestId('cover-link')
    expect(linkElement).not.toBeInTheDocument()
  })

  test('should render the wrapper links if there is productInfo', () => {
    const linkElement = screen.getByTestId('cover-link')
    expect(linkElement).toBeInTheDocument()
  })
})
