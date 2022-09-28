import React from 'react'
import { render, screen, act } from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'

import { SocialIconLinks } from '@/common/CoverProfileInfo/SocialIconLinks'

describe('SocialIconLinks test', () => {
  const props = {
    links: {
      website: 'https://www.animatedbrands.com',
      twitter: 'https://twitter.com/animatedbrands',
      blog: 'https://animatedbrands.medium.com',
      linkedin: 'https://www.linkedin.com/company/animated-brands'
    }
  }

  beforeEach(() => {
    act(() => {
      i18n.activate('en')
    })
    render(<SocialIconLinks {...props} />)
  })

  test('should render the container', () => {
    const wrapper = screen.getByTestId('socialiconlinks-container')
    expect(wrapper).toBeInTheDocument()
  })

  test('should render the IconLink inside main container', () => {
    const iconlinks = screen.getAllByTestId('icon-link')
    expect(iconlinks).toBeTruthy()
  })

  test('should have correct text in link', () => {
    const linkedinLinkText = screen
      .getAllByTestId('icon-link')[0]
      .querySelector('span')
    expect(linkedinLinkText).toHaveTextContent('LinkedIn')
  })

  test('should have correct href link', () => {
    const linkedinLink = screen.getAllByTestId('icon-link')[0]
    expect(linkedinLink).toHaveAttribute('href', props.links.linkedin)
  })
})
