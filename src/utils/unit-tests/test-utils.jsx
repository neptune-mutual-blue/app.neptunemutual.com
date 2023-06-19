import React from 'react'

import { en } from 'make-plural/plurals'
import { RouterContext } from 'next/dist/shared/lib/router-context'

import { ACTIVE_CONNECTOR_KEY } from '@/lib/connect-wallet/config/localstorage'
import { getLibrary } from '@/lib/connect-wallet/utils/web3'
import { ToastProvider } from '@/lib/toast/provider'
import { messages as enMessages } from '@/locales/en/messages'
// import { messages as frMessages } from '@/locales/fr/messages'
// import { messages as jaMessages } from '@/locales/ja/messages'
// import { messages as zhMessages } from '@/locales/zh/messages'
import { DEFAULT_VARIANT } from '@/src/config/toast'
import { AppConstantsProvider } from '@/src/context/AppConstants'
import {
  CoversAndProductsProvider2
} from '@/src/context/CoversAndProductsData2'
import { NetworkProvider } from '@/src/context/Network'
import { SortableStatsProvider } from '@/src/context/SortableStatsContext'
import { TxPosterProvider } from '@/src/context/TxPoster'
import { UnlimitedApprovalProvider } from '@/src/context/UnlimitedApproval'
import { createMockRouter } from '@/utils/unit-tests/createMockRouter'
import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor
} from '@testing-library/react'
import { Web3ReactProvider } from '@web3-react/core'

i18n.load({
  en: enMessages
  // fr: frMessages,
  // ja: jaMessages,
  // zh: zhMessages
})
i18n.loadLocaleData({
  en: { plurals: en }
  // fr: { plurals: fr },
  // ja: { plurals: ja },
  // zh: { plurals: zh }
})

const NoProviders = ({ children }) => { return <>{children}</> }

const AllTheProviders = ({ children, router = createMockRouter({}) }) => {
  return (
    <RouterContext.Provider value={router}>
      <I18nProvider i18n={i18n}>
        <Web3ReactProvider getLibrary={getLibrary}>
          <UnlimitedApprovalProvider>
            <ToastProvider variant={DEFAULT_VARIANT}>
              <TxPosterProvider>{children}</TxPosterProvider>
            </ToastProvider>
          </UnlimitedApprovalProvider>
        </Web3ReactProvider>
      </I18nProvider>
    </RouterContext.Provider>
  )
}

export const withProviders = (
  Component,
  router = createMockRouter({}),
  props = {}
) => {
  return function Wrapper () {
    return (
      <AllTheProviders router={router}>
        <Component {...props} />
      </AllTheProviders>
    )
  }
}

export const withSorting = (Component) => {
  return function Wrapper () {
    return (
      <SortableStatsProvider>
        <Component />
      </SortableStatsProvider>
    )
  }
}

export const withDataProviders = (Component, router = createMockRouter({})) => {
  return function Wrapper () {
    return (
      <RouterContext.Provider value={router}>
        <I18nProvider i18n={i18n}>
          <Web3ReactProvider getLibrary={getLibrary}>
            <NetworkProvider>
              <AppConstantsProvider>
                <CoversAndProductsProvider2>
                  <UnlimitedApprovalProvider>
                    <ToastProvider variant={DEFAULT_VARIANT}>
                      <TxPosterProvider>
                        <Component />
                      </TxPosterProvider>
                    </ToastProvider>
                  </UnlimitedApprovalProvider>
                </CoversAndProductsProvider2>
              </AppConstantsProvider>
            </NetworkProvider>
          </Web3ReactProvider>
        </I18nProvider>
      </RouterContext.Provider>
    )
  }
}

const customRender = (ui, options = {}) => {
  return render(ui, {
    wrapper: options?.noProviders ? NoProviders : AllTheProviders,
    ...options
  })
}

export { act, cleanup, customRender as render, fireEvent, screen, waitFor }

const LocalStorage = (() => {
  let store = {
    [ACTIVE_CONNECTOR_KEY]: 'injected'
  }

  return {
    getItem: (key, defaultValue = '') => {
      return store[key] || defaultValue
    },
    setItem: (key, value) => {
      store[key] = value
    },
    clear: () => {
      store = {}
    },
    removeItem: (key) => {
      delete store[key]
    },
    assign: jest.fn(() => {})
  }
})()

Object.defineProperty(window, 'localStorage', { value: LocalStorage })
Object.defineProperty(window, 'location', {
  value: {
    href: ''
  },
  writable: true
})

export const mockLanguage = jest.spyOn(window.navigator, 'language', 'get')

export const originalProcess = process
global.process = { ...originalProcess, browser: true }

global.crypto = {
  getRandomValues: jest.fn().mockReturnValueOnce(new Uint32Array(10))
}

const ETHEREUM_METHODS = {
  eth_requestAccounts: () => { return ['0xaC43b98FE7352897Cbc1551cdFDE231a1180CD9e'] }
}

global.ethereum = {
  enable: jest.fn(() => { return Promise.resolve(true) }),
  send: jest.fn((method) => {
    if (method === 'eth_chainId') {
      return Promise.resolve(1)
    }

    if (method === 'eth_requestAccounts') {
      return Promise.resolve('0xaC43b98FE7352897Cbc1551cdFDE231a1180CD9e')
    }

    return Promise.resolve(true)
  }),
  request: jest.fn(async ({ method }) => {
    if (Object.prototype.hasOwnProperty.call(ETHEREUM_METHODS, method)) {
      return ETHEREUM_METHODS[method]
    }

    return ''
  }),
  on: jest.fn(() => {})
}

global.scrollTo = jest.fn(() => {})

export const delay = (ms = 1000) => {
  return new Promise((resolve) => {
    setTimeout(() => { return resolve() }, ms)
  })
}
