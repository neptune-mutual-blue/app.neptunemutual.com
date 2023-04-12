import React, {
  useEffect,
  useState
} from 'react'

import Router from 'next/router'

import {
  CookiePolicy,
  getLSAcceptedCookie
} from '@/common/CookiePolicy'

import { Header } from '@/common/Header/Header'
import { NetworkSwitchPopup } from '@/common/NetworkSwitchPopup'
import { ScrollToTopButton } from '@/common/ScrollToTop/ScrollToTopButton'
import { Footer } from '@/common/Footer/Footer'

export const PageLoader = () => {
  const [showLoader, setShowLoader] = useState(false)

  useEffect(() => {
    const show = () => setShowLoader(true)
    const hide = () => setShowLoader(false)

    Router.events.on('routeChangeStart', show)
    Router.events.on('routeChangeComplete', hide)
    Router.events.on('routeChangeError', hide)

    return () => {
      Router.events.off('routeChangeStart', show)
      Router.events.off('routeChangeComplete', hide)
      Router.events.off('routeChangeError', hide)
    }
  }, [])

  if (!showLoader) {
    return null
  }

  return (
    <div className='fixed top-0 z-50 w-full bg-gray-200'>
      <div data-testid='progress-bar' className='w-full h-2 shim-progress' />
    </div>
  )
}

export const MainLayout = ({ noHeader = false, children }) => {
  const [isCookieOpen, setIsCookieOpen] = useState(() => getLSAcceptedCookie() === undefined)

  return (
    <>
      <PageLoader />

      {!noHeader && <Header />}

      <div className='relative sm:static'>
        {children}

        <CookiePolicy
          isOpen={isCookieOpen}
          onClose={() => setIsCookieOpen(false)}
        />

        {(!isCookieOpen) && <NetworkSwitchPopup />}
        <ScrollToTopButton />
      </div>

      <Footer />
    </>
  )
}
