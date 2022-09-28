import React from 'react'
import { render, screen, act, fireEvent } from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'
import { TabHeader } from '@/common/Tab/TabHeader'

describe('TabHeader test', () => {
  const mockFn = jest.fn()
  const props = {
    activeTab: 'info',
    headers: [
      {
        name: 'info',
        displayAs: 'Info'
      },
      {
        name: 'product',
        displayAs: 'Product'
      }
    ],
    onClick: mockFn
  }
  beforeEach(async () => {
    act(() => {
      i18n.activate('en')
    })
    render(<TabHeader {...props} />)
  })

  test('should render the component correctly', () => {
    const wrapper = screen.getByTestId('tab-header-container')
    expect(wrapper).toBeInTheDocument()
  })

  test('should render correct number of <Tab /> component', () => {
    const tabs = screen.queryAllByTestId('tab-container')
    expect(tabs.length).toBe(props.headers.length)
  })

  test('should render correct text in the button', () => {
    const buttons = screen.queryAllByTestId('tab-btn')
    expect(buttons[0].textContent).toBe(props.headers[0].displayAs)
    expect(buttons[1].textContent).toBe(props.headers[1].displayAs)
  })

  test('should call the onClick function when button clicked', () => {
    const button = screen.queryAllByTestId('tab-btn')[0]
    fireEvent.click(button)
    expect(mockFn).toHaveBeenCalled()
  })
})
