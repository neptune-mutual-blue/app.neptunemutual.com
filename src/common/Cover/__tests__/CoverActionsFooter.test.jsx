import { CoverActionsFooter } from '@/common/Cover/CoverActionsFooter'
import { screen, act, render } from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'
import * as Router from 'next/router'
import { actions as coverActions } from '@/src/config/cover/actions'

const mockFunction = (file, method, returnData) => {
  jest.spyOn(file, method).mockImplementation(() => returnData)
}

describe('CoverCard component', () => {
  const routerProps = {
    query: { coverId: 'animated-brands' }
  }

  mockFunction(Router, 'useRouter', routerProps)

  const props = {
    activeKey: 'add-liquidity',
    coverKey: 'animated-brands'
  }
  beforeEach(() => {
    act(() => {
      i18n.activate('en')
    })
    render(
      <CoverActionsFooter
        activeKey={props.activeKey}
        coverKey={props.coverKey}
      />
    )
  })

  test('should render the outer OutlineCard', () => {
    const wrapper = screen.getByTestId('main-container')
    expect(wrapper).toBeInTheDocument()
  })

  test('should render correct number of cover-action cards', () => {
    const cards = screen.getAllByTestId('cover-action-card')
    const cardsLength = Object.keys(coverActions).filter(
      (x) => x !== props.activeKey
    ).length
    expect(cards.length).toBe(cardsLength)
  })

  test('should have correct cover-action card link', () => {
    const cards = screen.getAllByTestId('cover-action-card')
    const card = cards[0]
    const link = card.getAttribute('href')

    const actions = Object.keys(coverActions).filter(
      (x) => x !== props.activeKey
    )
    const href = coverActions[actions[0]].getHref(routerProps.query.coverId)

    expect(link).toBe(href)
  })
})
