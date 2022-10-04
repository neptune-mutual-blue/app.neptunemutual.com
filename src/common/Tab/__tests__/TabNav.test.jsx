import React from 'react'
import { render, screen, act } from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'
import { TabNav } from '@/common/Tab/TabNav'

describe('TabNav test', () => {
  const props = {
    activeTab: 'info',
    headers: [
      {
        name: 'info',
        displayAs: 'Info',
        href: '/info'
      },
      {
        name: 'product',
        displayAs: 'Product',
        href: '/product'
      }
    ]
  }
  beforeEach(async () => {
    act(() => {
      i18n.activate('en')
    })
    render(<TabNav {...props} />)
  })

  test('should render the component correctly', () => {
    const wrapper = screen.getByTestId('tab-nav-container')
    expect(wrapper).toBeInTheDocument()
  })

  test('should render correct number of <Tab /> component based on props', () => {
    const tabs = screen.queryAllByTestId('tab-container')
    expect(tabs.length).toBe(props.headers.length)
  })

  test('should render correct href link', () => {
    const link = screen.queryByText(props.headers[0].displayAs)
    expect(link).toHaveAttribute('href', props.headers[0].href)
  })
})
