const { SingleImage } = require('@/common/SingleImage')
const { initiateTest } = require('@/utils/unit-tests/test-mockup-fn')
const { screen } = require('@testing-library/react')

describe('SingleImage', () => {
  const props = {
    src: '/images/test.png',
    alt: 'test'
  }
  const { initialRender } = initiateTest(SingleImage, props)

  beforeEach(() => {
    initialRender()
  })

  test('should render the component properly', () => {
    const imageContainer = screen.getByTestId('image-container')
    expect(imageContainer).toBeInTheDocument()
  })

  test('image should have correct source', () => {
    const image = screen.getByTestId('image-container').firstChild
    expect(image).toHaveAttribute('src', props.src)
  })

  test('image should have correct alt', () => {
    const image = screen.getByTestId('image-container').firstChild
    expect(image).toHaveAttribute('alt', props.alt)
  })
})
