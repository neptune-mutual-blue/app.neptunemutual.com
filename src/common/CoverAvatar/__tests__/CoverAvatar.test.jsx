import { CoverAvatar } from '@/common/CoverAvatar/CoverAvatar'
import {
  act,
  fireEvent,
  render,
  screen
} from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'

const props = {
  imgs: [
    {
      src: '/images/covers/empty_0.svg',
      alt: 'empty_0'
    },
    {
      src: '/images/covers/empty_1.svg',
      alt: 'empty_1'
    },
    {
      src: '/images/covers/empty_2.svg',
      alt: 'empty_2'
    },
    {
      src: '/images/covers/empty_3.svg',
      alt: 'empty_3'
    }
  ]
}

describe('CoverAvatar component', () => {
  beforeAll(() => {
    act(() => {
      i18n.activate('en')
    })
  })

  test('should return null if there is no coverinfo', () => {
    render(<CoverAvatar />)
    const divElement = screen.queryByTestId('cover-img')
    expect(divElement).not.toBeInTheDocument()
  })

  test('should show single img if cover is not diversified', () => {
    render(
      <CoverAvatar imgs={[props.imgs[0]]} />
    )
    const divElement = screen.getByTestId('cover-img')
    expect(divElement).toBeInTheDocument()
  })

  test('should show different images according to number of products if cover is diversified', () => {
    render(
      <CoverAvatar
        imgs={props.imgs}
      />
    )
    const images = screen.getAllByTestId('cover-img')
    expect(images.length).toEqual(
      props.imgs.length > 3
        ? 3
        : props.imgs.length
    )
  })

  test('should have More if the products length is more than 3', () => {
    render(
      <CoverAvatar
        imgs={props.imgs}
      />
    )
    const moreText = screen.getByText(/MORE/i)
    expect(moreText).toBeInTheDocument()
  })

  test('should show empty images in case of error', () => {
    const screen = render(
      <CoverAvatar
        imgs={[props.imgs[0]]}
      />
    )
    const imgs = screen.getByTestId('cover-img')
    fireEvent.error(imgs, { target: imgs })

    expect(imgs).toHaveAttribute('src', '/images/covers/empty.svg')
  })
})
