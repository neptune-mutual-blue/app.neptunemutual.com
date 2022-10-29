import * as amplitude from '@amplitude/analytics-node'

const events = {
  PREMIUM: 'PREMIUM',
  LIQUIDITY: 'LIQUIDITY'
}

const init = (option) => {
  option = option || {}

  amplitude.init(process.env.AMPLITUDE_API_KEY, {
    // apiEndPoint: 'https://amp.analytics.neptunemutual.com',
    serverZone: amplitude.Types.ServerZone.EU,
    ...option
  })
}

const log = (funnel, journey, step, seq, account, event, props) => {
  init()

  if (account) {
    amplitude.identify(new amplitude.Identify({ user_id: account }))
  }

  if (props) {
    amplitude.track(event, { funnel, journey, step, seq, ...props })
    return
  }

  amplitude.track(event)
}

const logPremium = (account, coverKey, productKey, dollarValue) => {
  // funnel: Policy Purchase
  // journey: Purchase-Policy-Page-2
  // sequence: 9999
  // event: 'Closed/Won'

  init()

  if (account) {
    amplitude.identify(new amplitude.Identify({ user_id: account }))
  }

  const productId = productKey ? `${coverKey}/${productKey}` : coverKey

  amplitude.logRevenueV2(new amplitude.Revenue()
    .setProductId(productId)
    .setRevenueType(events.PREMIUM)
    .setPrice(dollarValue))
}

const logAddLiquidity = (account, coverKey, productKey, dollarValue) => {
  // funnel: Liquidity Addition
  // journey: Add-Liquidity-Page-2
  // sequence: 9999
  // event: 'Closed/Won'

  init()

  if (account) {
    amplitude.identify(new amplitude.Identify({ user_id: account }))
  }

  const productId = productKey ? `${coverKey}/${productKey}` : coverKey

  amplitude.logRevenueV2(new amplitude.Revenue()
    .setProductId(productId)
    .setRevenueType(events.LIQUIDITY)
    .setPrice(dollarValue))
}

const logWalletConnected = (account) => {
  init()
  amplitude.identify(new amplitude.Identify({ user_id: account }))
}

export { log, logAddLiquidity, logPremium, logWalletConnected }
