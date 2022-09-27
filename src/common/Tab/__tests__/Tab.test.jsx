import React from 'react'
import { render, screen, act } from '@/utils/unit-tests/test-utils'
import { Tab } from '@/common/Tab/Tab'
import { i18n } from '@lingui/core'

describe('Tab test', () => {
  const props = {
    active: true,
    className: '',
    children: <></>
  }
  beforeEach(async () => {
    act(() => {
      i18n.activate('en')
    })
    render(<Tab {...props} />)
  })

  test('should render the component correctly', () => {
    const wrapper = screen.getByTestId('tab-container')
    expect(wrapper).toBeInTheDocument()
  })

  test('should have `text-4e7dd9` class when active is true', () => {
    const wrapper = screen.getByTestId('tab-container')
    expect(wrapper).toHaveClass('text-4e7dd9')
  })

  test('should have `text-black` class when active is false', () => {
    render(<Tab {...props} active={false} />)
    const wrapper = screen.getAllByTestId('tab-container')
    expect(wrapper[1]).toHaveClass('text-black')
  })
})
