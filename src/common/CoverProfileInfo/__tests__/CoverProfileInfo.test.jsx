import React from 'react'

import { CoverProfileInfo } from '@/common/CoverProfileInfo/CoverProfileInfo'
import {
  act,
  render,
  screen
} from '@/utils/unit-tests/test-utils'
import { i18n } from '@lingui/core'

// import * as coverStatsContext from '../../Cover/CoverStatsContext'

describe('CoverProfileInfo test', () => {
  const props = {
    imgSrc: '/images/covers/animated-brands.svg',
    projectName: 'Animated Brands',
    links: {
      website: 'https://www.animatedbrands.com',
      twitter: 'https://twitter.com/animatedbrands',
      blog: 'https://animatedbrands.medium.com',
      linkedin: 'https://www.linkedin.com/company/animated-brands'
    },
    coverKey:
      '0x616e696d617465642d6272616e64730000000000000000000000000000000000',
    productKey: '0'
  }

  // jest
  //   .spyOn(coverStatsContext, 'useCoverStatsContext')
  //   .mockImplementation(() => ({
  //     productStatus: 'active',
  //     activeIncidentDate: '12232323',
  //     claimPlatformFee: '0',
  //     commitment: '0',
  //     isUserWhitelisted: false,
  //     reporterCommission: '0',
  //     reportingPeriod: '0',
  //     requiresWhitelist: false,
  //     activeCommitment: '0',
  //     totalPoolAmount: '0',
  //     availableLiquidity: '0',
  //     refetch: () => Promise.resolve(1)
  //   }))

  beforeEach(() => {
    act(() => {
      i18n.activate('en')
    })
    render(<CoverProfileInfo {...props} />)
  })

  test('should render the component correctly', () => {
    const wrapper = screen.getByTestId('dedicated-coverprofileinfo-container')
    expect(wrapper).toBeInTheDocument()
  })

  test('should render ProjectImage component', () => {
    const wrapper = screen.getByTestId('projectimage-container')
    expect(wrapper).toBeInTheDocument()
  })

  test('should render ProjectName component', () => {
    const wrapper = screen.getByTestId('projectname-container')
    expect(wrapper).toBeInTheDocument()
  })

  test('should render ProjectStatusIndicator component', () => {
    const wrapper = screen.getByTestId('projectstatusindicator-container')
    expect(wrapper).toBeInTheDocument()
  })

  test('should render ProjectWebsiteLink component', () => {
    const wrapper = screen.getByTestId('projectwebsitelink-container')
    expect(wrapper).toBeInTheDocument()
  })

  test('should render SocialIconLinks component', () => {
    const wrapper = screen.getByTestId('socialiconlinks-container')
    expect(wrapper).toBeInTheDocument()
  })
})
