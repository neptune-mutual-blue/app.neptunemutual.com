import { E_CARD_STATUS } from '@/common/CardStatusBadge'
import { Card } from '@/common/CoverProfileInfo/CoverProfileInfo'
import { safeParseBytes32String } from '@/utils/formatter/bytes32String'
import { initiateTest } from '@/utils/unit-tests/helpers'
import {
  act,
  screen
} from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'

describe('ProjectStatusIndicator test', () => {
  const props = {
    coverKey:
      '0x616e696d617465642d6272616e64730000000000000000000000000000000000',
    productKey: '0',
    status: E_CARD_STATUS.NORMAL,
    incidentDate: '0'
  }

  beforeEach(() => {
    act(() => {
      i18n.activate('en')
    })
  })

  test('should render normal when no status is provided', () => {
    const { initialRender } = initiateTest(Card, { ...props, status: '' })
    initialRender()

    const wrapper = screen.queryByTestId('projectstatusindicator-container')
    const badge = screen.queryByTestId('card-badge')

    expect(wrapper).toHaveTextContent('Normal')
    expect(badge).toHaveClass('bg-21AD8C')
  })

  test('should render Normal status badge correctly', () => {
    const { initialRender } = initiateTest(Card, {
      ...props,
      status: E_CARD_STATUS.NORMAL
    })
    initialRender()

    const wrapper = screen.queryByTestId('projectstatusindicator-container')
    const badge = screen.queryByTestId('card-badge')

    expect(wrapper).toHaveTextContent('Normal')
    expect(badge).toHaveClass('bg-21AD8C')
  })

  test('should render Incident Occurred status badge correctly', () => {
    const { initialRender } = initiateTest(Card, {
      ...props,
      status: E_CARD_STATUS.INCIDENT
    })
    initialRender()

    const wrapper = screen.queryByTestId('projectstatusindicator-container')
    const badge = screen.queryByTestId('card-badge')

    expect(wrapper).toHaveTextContent('Incident Occurred')
    expect(badge).toHaveClass('bg-FA5C2F')
  })

  test('should render Claimable status badge correctly', () => {
    const { initialRender } = initiateTest(Card, {
      ...props,
      status: E_CARD_STATUS.CLAIMABLE
    })
    initialRender()

    const wrapper = screen.queryByTestId('projectstatusindicator-container')
    const badge = screen.queryByTestId('card-badge')

    expect(wrapper).toHaveTextContent('Claimable')
    expect(badge).toHaveClass('bg-4289F2')
  })

  test('should render Stopped status badge correctly', () => {
    const { initialRender } = initiateTest(Card, {
      ...props,
      status: E_CARD_STATUS.STOPPED
    })
    initialRender()

    const wrapper = screen.queryByTestId('projectstatusindicator-container')
    const badge = screen.queryByTestId('card-badge')

    expect(wrapper).toHaveTextContent('Stopped')
    expect(badge).toHaveClass('bg-9B9B9B')
  })

  test('should render False Reporting status badge correctly', () => {
    const { initialRender } = initiateTest(Card, {
      ...props,
      status: E_CARD_STATUS.FALSE_REPORTING
    })
    initialRender()

    const wrapper = screen.queryByTestId('projectstatusindicator-container')
    const badge = screen.queryByTestId('card-badge')

    expect(wrapper).toHaveTextContent('False Reporting')
    expect(badge).toHaveClass('bg-21AD8C')
  })

  test('should render Diversified status badge correctly', () => {
    const { initialRender } = initiateTest(Card, {
      ...props,
      status: E_CARD_STATUS.DIVERSIFIED
    })
    initialRender()

    const wrapper = screen.queryByTestId('projectstatusindicator-container')
    const badge = screen.queryByTestId('card-badge')

    expect(wrapper).toHaveTextContent('Diversified')
    expect(badge).toHaveClass('bg-364253')
  })

  test('should be link when incidentreport is valid', () => {
    const { initialRender } = initiateTest(Card, {
      ...props,
      incidentDate: '123124324'
    })
    initialRender()

    const badgeLink = screen.queryByTestId('badge-link')

    expect(badgeLink).toBeInTheDocument()
  })

  test('should have correct badge link as provided in props', () => {
    const incidentDate = '123124324'
    const href = `/reports/${safeParseBytes32String(props.coverKey)}/products/${
      props.productKey
    }/incidents/${incidentDate}/details`

    const { initialRender } = initiateTest(Card, {
      ...props,
      incidentDate
    })
    initialRender()

    const wrapper = screen.getByTestId('badge-link')

    expect(wrapper).toHaveAttribute('href', href)
  })
})
