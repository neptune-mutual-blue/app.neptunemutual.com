import { Badge, CARD_STATUS, identifyStatus } from '@/common/CardStatusBadge'
import { initiateTest } from '@/utils/unit-tests/test-mockup-fn'
import { screen } from '@testing-library/react'

describe('CardStatusBadge component behaviour', () => {
  const props = {
    status: 'FALSE_REPORTING',
    className: 'rounded',
    defaultValue: {
      label: 'Normal',
      className: 'bg-21AD8C'
    },
    icon: false
  }
  const { initialRender, rerenderFn } = initiateTest(Badge, props)

  beforeEach(() => {
    initialRender()
  })

  test('should render render the main component', () => {
    const wrapper = screen.getByTestId('card-badge')
    expect(wrapper).toBeInTheDocument()
  })

  test('should render the status text', () => {
    const wrapper = screen.getByTestId('card-badge')
    expect(wrapper).toHaveTextContent(CARD_STATUS[props.status].label)
  })

  test('should not render the icon if icon is false', () => {
    const icon = screen.queryByTestId('card-badge').querySelector('svg')
    expect(icon).toBeNull()
  })

  test('should render the icon if icon is true', () => {
    rerenderFn({ ...props, icon: true })
    const icon = screen.getByTestId('card-badge').querySelector('svg')
    expect(icon).toBeInTheDocument()
  })

  describe('identifyStatus function', () => {
    test('should return the status if it is false reporting', () => {
      const status = 'FALSE REPORTING'
      const result = identifyStatus(status)
      expect(result).toEqual('FALSE_REPORTING')
    })

    test('should return the status if it is `incident happened` or `incident occured`', () => {
      const status = 'INCIDENT HAPPENED'
      const result = identifyStatus(status)
      expect(result).toEqual('INCIDENT')

      const status2 = 'INCIDENT OCCURRED'
      const result2 = identifyStatus(status2)
      expect(result2).toEqual('INCIDENT')
    })

    test('should return the status if it is normal', () => {
      const status = 'NORMAL'
      const result = identifyStatus(status)
      expect(result).toEqual('NORMAL')
    })

    test('should return the status if it is claimable', () => {
      const status = 'CLAIMABLE'
      const result = identifyStatus(status)
      expect(result).toEqual('CLAIMABLE')
    })

    test('should return the status if it is diversified', () => {
      const status = 'DIVERSIFIED'
      const result = identifyStatus(status)
      expect(result).toEqual('DIVERSIFIED')
    })

    test('should return the default value if the status is not defined', () => {
      const status = ''
      const result = identifyStatus(status)
      expect(result).toEqual('NORMAL')
    })
  })
})
