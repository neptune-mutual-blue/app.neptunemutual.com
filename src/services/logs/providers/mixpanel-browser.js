import mixpanel from 'mixpanel-browser'

const stories = {
  POLICY_PURCHASED: 'Policy Purchased',
  LIQUIDITY_ADDED: 'Liquidity Added'
}

const init = (option) => {
  option = option || {}

  mixpanel.init(process.env.MIXPANEL_API_KEY, null, {
    api_host: 'https://mp.analytics.neptunemutual.com',
    ...option
  })
}

const log = (funnel, journey, step, seq, account, event, props) => {
  init()

  if (account) {
    mixpanel.identify(account)
  }

  if (props) {
    mixpanel.track(event, { funnel, journey, step, seq, ...props })
    return
  }

  mixpanel.track(event)
}

const logPremium = (account, coverKey, productKey, dollarValue) => {
  // funnel: Policy Purchase
  init()

  if (account) {
    mixpanel.identify(account)
  }

  mixpanel.time_event(stories.POLICY_PURCHASED)
  mixpanel.track(stories.POLICY_PURCHASED, { account, coverKey, productKey, dollarValue })
}

const logAddLiquidity = (account, coverKey, productKey, dollarValue) => {
  // funnel: Liquidity Addition
  init()

  if (account) {
    mixpanel.identify(account)
  }

  mixpanel.time_event(stories.LIQUIDITY_ADDED)
  mixpanel.track(stories.LIQUIDITY_ADDED, { account, coverKey, productKey, dollarValue })
}

const logWalletConnected = (account) => {
  init()
  mixpanel.identify(account)
}

export { log, logAddLiquidity, logPremium, logWalletConnected }
