import { SeeMoreParagraph } from '@/common/SeeMoreParagraph'
import { initiateTest } from '@/utils/unit-tests/test-mockup-fn'
import { fireEvent, screen } from '@testing-library/react'

const props = {
  text: 'The 1inch Network unites decentralized protocols whose synergy enables the most lucrative, fastest, and protected operations in the DeFi space by offering access to hundreds of liquidity sources across multiple chains. The 1inch Network was launched at the ETHGlobal New York hackathon in May 2019 with the release of its Aggregation Protocol v1. Since then, 1inch Network has developed additional DeFi tools such as the Liquidity Protocol, Limit Order Protocol, P2P transactions, and 1inch Mobile Wa...'
}

describe('SeeMoreParagrapgh component', () => {
  const { initialRender } = initiateTest(SeeMoreParagraph, props)

  beforeEach(() => {
    initialRender()
  })

  test('should render the text content', () => {
    const text = screen.getByTestId('text-wrapper')
    expect(text).toBeInTheDocument()
  })

  describe('`See more`/`See less` button', () => {
    Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
      configurable: true,
      value: 500
    })

    test("should display with text 'See more'", () => {
      const button = screen.getByTestId('button')
      expect(button.textContent).toBe('See more')
      expect(button).toBeInTheDocument()
    })

    test("should change text to 'See less' on click", () => {
      let button = screen.getByTestId('button')
      fireEvent.click(button)

      button = screen.getByTestId('button')
      expect(button.textContent).toBe('See less')
    })
  })
})
