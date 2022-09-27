import {
  render,
  act
} from '@/utils/unit-tests/test-utils'
import { Loader } from '../Loader'
import { i18n } from '@lingui/core'

describe('Loader component', () => {
  beforeAll(() => {
    act(() => {
      i18n.activate('en')
    })
  })

  test('should render Loader children component', () => {
    const { getByRole } = render(<Loader role='img' />)

    const svgElement = getByRole('img')
    expect(svgElement).toBeInTheDocument()
  })

  test('can pass attributes as prop', () => {
    const { getByTestId } = render(<Loader data-testid='svg-mock' />)

    const svgElement = getByTestId('svg-mock')
    expect(svgElement).toBeInTheDocument()
  })
})
