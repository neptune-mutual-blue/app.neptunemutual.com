import React from 'react'
import { render, screen, act } from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'

import { ProjectWebsiteLink } from '@/common/CoverProfileInfo/ProjectWebsiteLink'

describe('ProjectWebsiteLink test', () => {
  const props = {
    website: 'https://www.animatedbrands.com'
  }

  beforeEach(() => {
    act(() => {
      i18n.activate('en')
    })
    render(<ProjectWebsiteLink {...props} />)
  })

  test('should render the container', () => {
    const wrapper = screen.getByTestId('projectwebsitelink-container')
    expect(wrapper).toBeInTheDocument()
  })

  test('should have correct link in href', () => {
    const wrapper = screen
      .getByTestId('projectwebsitelink-container')
      .querySelector('a')
    expect(wrapper).toHaveAttribute('href', props.website)
  })

  test('should have correct text in link', () => {
    const wrapper = screen
      .getByTestId('projectwebsitelink-container')
      .querySelector('a')
    const textContent = props.website
      .replace(/(^\w+:|^)\/\//, '')
      .replace(/\/$/, '')
    expect(wrapper).toHaveTextContent(textContent)
  })
})
