import React from 'react'
import { render, screen, act, fireEvent } from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'

import { ProjectImage } from '@/common/CoverProfileInfo/ProjectImage'

describe('ProjectImage test', () => {
  const props = {
    imgSrc: '/images/covers/animated-brands.svg',
    name: 'Animated Brands'
  }

  beforeEach(() => {
    act(() => {
      i18n.activate('en')
    })
    render(<ProjectImage {...props} />)
  })

  test('should render the component correctly', () => {
    const wrapper = screen.getByTestId('projectimage-container')
    expect(wrapper).toBeInTheDocument()
  })

  test('should render correct img src for project image', () => {
    const wrapper = screen
      .getByTestId('projectimage-container')
      .querySelector('img')
    expect(wrapper).toHaveAttribute('src', props.imgSrc)
  })

  test('should render empty img src for project image on error', () => {
    const wrapper = screen
      .getByTestId('projectimage-container')
      .querySelector('img')

    fireEvent.error(wrapper, { target: wrapper })
    expect(wrapper).toHaveAttribute('src', '/images/covers/empty.svg')
  })

  test('should render correct alt-text for the image', () => {
    const wrapper = screen
      .getByTestId('projectimage-container')
      .querySelector('img')
    expect(wrapper).toHaveAttribute('alt', props.name)
  })
})
