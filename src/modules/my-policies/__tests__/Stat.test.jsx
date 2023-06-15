import { screen } from '@/utils/unit-tests/test-utils'

import { Stat } from '@/modules/my-policies/PolicyCardFooter'
import { initiateTest } from '@/utils/unit-tests/helpers'

const props = {
  title: 'Expires In',
  tooltip: 'Jul 1, 2022, 5:44:59 AM GMT+5:45',
  value: 'in 3 weeks',
  right: false,
  variant: undefined
}
describe('PoliciesTab test', () => {
  const { initialRender, rerenderFn } = initiateTest(Stat, props)

  beforeEach(() => {
    initialRender()
  })

  test('should render the main container', () => {
    const stat = screen.getByTestId('footer-stat')
    expect(stat).toBeInTheDocument()
  })

  test('should render correct stat title', () => {
    const container = screen.getByTestId('footer-stat')
    const title = container.querySelector('h5')
    expect(title.textContent).toBe(props.title)
  })

  test('should render correct stat value', () => {
    const container = screen.getByTestId('footer-stat')
    const value = container.querySelector('p')
    expect(value.textContent).toBe(props.value)
  })

  test("should have class `text-FA5C2F` if variant is 'error'", () => {
    rerenderFn({ ...props, variant: 'error' })
    const container = screen.getByTestId('footer-stat')
    const value = container.querySelector('p')
    expect(value).toHaveClass('text-FA5C2F')
  })

  test("should have class `text-7398C0` if variant is not 'error'", () => {
    rerenderFn({ ...props, variant: 'normal' })
    const container = screen.getByTestId('footer-stat')
    const value = container.querySelector('p')
    expect(value).toHaveClass('text-7398C0')
  })

  test('should have correct `title` attribute', () => {
    const container = screen.getByTestId('footer-stat')
    const value = container.querySelector('p')
    expect(value.getAttribute('title')).toBe(props.tooltip)
  })
})
