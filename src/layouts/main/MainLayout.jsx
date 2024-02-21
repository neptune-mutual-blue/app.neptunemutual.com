import React, {
  useEffect,
  useState
} from 'react'

import Router from 'next/router'

import { CookiePolicy } from '@/common/CookiePolicy'
import { Footer } from '@/common/Footer/Footer'
import { Header } from '@/common/Header/Header'
import { NetworkSwitchPopup } from '@/common/NetworkSwitchPopup'
import { ScrollToTopButton } from '@/common/ScrollToTop/ScrollToTopButton'
import { useLocalStorage } from '@/src/hooks/useLocalStorage'
import { LocalStorage } from '@/utils/localstorage'

export const PageLoader = () => {
  const [showLoader, setShowLoader] = useState(false)

  useEffect(() => {
    const show = () => { return setShowLoader(true) }
    const hide = () => { return setShowLoader(false) }

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

export const MainLayout = ({ children }) => {
  const [isCookieOpen, setIsCookieOpen] = useLocalStorage(LocalStorage.KEYS.COOKIE_POLICY, true)

  return (
    <>
      <PageLoader />

      <Header />

      <div className='relative sm:static'>
        {children}

        <CookiePolicy
          isOpen={isCookieOpen}
          onClose={() => { return setIsCookieOpen(false) }}
        />

        {(!isCookieOpen) && <NetworkSwitchPopup />}
        <ScrollToTopButton />
      </div>

      <Footer />
    </>
  )
}
