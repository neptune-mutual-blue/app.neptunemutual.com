import { HeaderLogo } from '@/common/HeaderLogo'
import { initiateTest } from '@/utils/unit-tests/helpers'
import { screen } from '@testing-library/react'

describe('Banner test', () => {
  const { initialRender } = initiateTest(HeaderLogo)

  beforeEach(() => {
    initialRender()
  })

  test('should render the image component', () => {
    const img = screen.getAllByTestId('header-logo')[1]
    expect(img).toBeInTheDocument()
  })

  test('should have correct alt text', () => {
    const img = screen.getAllByTestId('header-logo')[1]
    expect(img).toHaveAttribute('alt', 'Neptune Mutual')
  })

  test('should have correct srcSet', () => {
    const img = screen.getAllByTestId('header-logo')[1]
    const srcSet = '/logos/neptune-mutual-inverse-full-beta.svg'
    expect(img).toHaveAttribute('srcSet', srcSet)
  })
})
