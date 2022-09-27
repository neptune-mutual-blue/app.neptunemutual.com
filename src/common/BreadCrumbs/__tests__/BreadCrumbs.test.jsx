import { BreadCrumbs } from '@/common/BreadCrumbs/BreadCrumbs'
import { act, render } from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'

describe('Breadcrumb component', () => {
  beforeAll(() => {
    act(() => {
      i18n.activate('en')
    })
  })

  describe('different scenarios for Breadcrumbs Component', () => {
    test('should render unordered list', () => {
      const screen = render(
        <BreadCrumbs
          pages={[
            { name: 'Home', href: '/', current: false },
            {
              name: 'Animated Brands',
              href: '/cover/animated-brands',
              current: false
            },
            { name: 'Provide Liquidity', current: true }
          ]}
        />
      )
      const listElementContainer = screen.container.getElementsByTagName('ol')
      expect(listElementContainer.length).toEqual(1)
    })

    test('should have length of pages passed to it', () => {
      const screen = render(
        <BreadCrumbs
          pages={[
            { name: 'Home', href: '/', current: false },
            {
              name: 'Animated Brands',
              href: '/cover/animated-brands',
              current: false
            },
            { name: 'Provide Liquidity', current: true }
          ]}
        />
      )
      const listElements = screen.container.getElementsByTagName('li')
      expect(listElements.length).toEqual(3)
    })

    test('should have link element', () => {
      const screen = render(
        <BreadCrumbs
          pages={[
            { name: 'Home', href: '/', current: false },
            {
              name: 'Animated Brands',
              href: '/cover/animated-brands',
              current: false
            },
            { name: 'Provide Liquidity', current: true }
          ]}
        />
      )
      const brandLinkElement = screen.getByText('Animated Brands')
      expect(brandLinkElement).toHaveAttribute(
        'href',
        '/cover/animated-brands'
      )
    })
  })
})
