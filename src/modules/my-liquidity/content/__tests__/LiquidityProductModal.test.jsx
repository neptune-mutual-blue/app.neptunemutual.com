import {
  LiquidityProductModal
} from '@/modules/my-liquidity/content/LiquidityProductModal'
import { initiateTest } from '@/utils/unit-tests/helpers'
import { testData } from '@/utils/unit-tests/test-data'
import {
  fireEvent,
  screen
} from '@testing-library/react'

const data = testData.coversAndProducts2.data

describe('LiquidityProductModal', () => {
  const props = {
    productData: data,
    setShowModal: jest.fn()
  }
  const { initialRender } = initiateTest(LiquidityProductModal, props)

  beforeEach(() => {
    initialRender()
  })

  test('should render the main container', () => {
    const container = screen.getByTestId('liquidity-product-modal')
    expect(container).toBeInTheDocument()
  })

  test('should render the dialog close button', () => {
    const closeButton = screen
      .getByTestId('dialog-title')
      .querySelector('button')
    expect(closeButton).toBeInTheDocument()
  })

  test('should render correct product name', () => {
    const productName = screen
      .getByTestId('dialog-title')
      .querySelector('span')

    const expectedText = `${data.productInfoDetails.productName} Cover Terms`
    expect(productName.textContent).toBe(expectedText)
  })

  test('should render the correct number of cover rules', () => {
    const rules = screen.getByTestId('cover-rules').querySelectorAll('li')

    const expectedRules = data.productInfoDetails.parameters.reduce((acc, curr) => { return acc + curr.list.items.length }, 0)
    expect(rules.length).toBe(expectedRules)
  })

  test('should render correct rule text', () => {
    const rule = screen.getByTestId('cover-rules').querySelector('li')

    const expectedRule = `${data.productInfoDetails.parameters[0].list.items[0]}`
    expect(rule.textContent).toBe(expectedRule)
  })

  test('should rende the close button', () => {
    const closeButton = screen.getByTestId('close-button')
    expect(closeButton).toBeInTheDocument()
  })

  test('simulating close button click', () => {
    const closeButton = screen.getByTestId('close-button')
    closeButton.click()

    expect(props.setShowModal).toHaveBeenCalledWith(false)
  })

  test('should render the download button', () => {
    const downloadButton = screen.getByTestId('download-button')
    expect(downloadButton).toBeInTheDocument()
  })

  test('simulating download button click', () => {
    const downloadButton = screen.getByTestId('download-button')
    downloadButton.click()

    expect(props.setShowModal).toHaveBeenCalledWith(false)
  })

  test('simulating escape key press to close modal', () => {
    const container = screen.getByTestId('liquidity-product-modal')
    fireEvent.keyDown(container, {
      key: 'Escape',
      code: 'Escape',
      keyCode: 27,
      charCode: 27
    })
    expect(props.setShowModal).toHaveBeenCalledWith(false)
  })
})
