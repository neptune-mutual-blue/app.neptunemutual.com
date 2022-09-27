import React from 'react'
import { render, screen, act, fireEvent } from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'

import { CoverProfileInfoShort } from '@/common/CoverProfileInfo/CoverProfileInfoShort'

describe('CoverProfileInfoShort test', () => {
  const props = {
    imgSrc: '/images/covers/animated-brands.svg',
    title: 'Animated Brands',
    className: 'mb-7 lg:mb-28',
    fontSizeClass: 'text-h7 md:text-h4'
  }

  beforeEach(() => {
    act(() => {
      i18n.activate('en')
    })
    render(<CoverProfileInfoShort {...props} />)
  })

  test('should render the container', () => {
    const wrapper = screen.getByTestId('cover-profile-info-short')
    expect(wrapper).toBeInTheDocument()
  })

  test('should have prop classname', () => {
    const wrapper = screen.getByTestId('cover-profile-info-short')
    expect(wrapper).toHaveClass(props.className)
  })

  test('should have correct image src', () => {
    const wrapper = screen
      .getByTestId('cover-profile-info-short')
      .querySelector('img')
    expect(wrapper).toHaveAttribute('src', props.imgSrc)
  })

  test('should have correct image alt text', () => {
    const wrapper = screen
      .getByTestId('cover-profile-info-short')
      .querySelector('img')
    expect(wrapper).toHaveAttribute('alt', props.title)
  })

  test('should have fontSizeClass in h4 element', () => {
    const wrapper = screen
      .getByTestId('cover-profile-info-short')
      .querySelector('h4')
    expect(wrapper).toHaveClass(props.fontSizeClass)
  })

  test('should have correct text in h4 element', () => {
    const wrapper = screen
      .getByTestId('cover-profile-info-short')
      .querySelector('h4')
    expect(wrapper).toHaveTextContent(props.title)
  })
})

describe('CoverProfileInfoShort test', () => {
  const props = {
    imgSrc: 'error',
    title: 'Animated Brands',
    className: 'mb-7 lg:mb-28',
    fontSizeClass: 'text-h7 md:text-h4'
  }

  beforeAll(() => {
    act(() => {
      i18n.activate('en')
    })
  })

  test('should render empty svg as imgSrc is not correct', () => {
    render(<CoverProfileInfoShort {...props} />)
    const wrapper = screen
      .getByTestId('cover-profile-info-short')
      .querySelector('img')

    fireEvent.error(wrapper, { target: wrapper })

    expect(wrapper).toHaveAttribute('src', '/images/covers/empty.svg')
  })
})
