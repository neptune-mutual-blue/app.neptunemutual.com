import mixpanel from 'mixpanel'

const stories = {
  POLICY_PURCHASED: 'Policy Purchased',
  LIQUIDITY_ADDED: 'Liquidity Added'
}

// @TODO: remove after confirmation
// const init = (option) => {
//   option = option || {}

//   mixpanel.init(process.env.MIXPANEL_API_KEY, null, {
//     api_host: 'https://mp.analytics.neptunemutual.com',
//     ...option
//   })
// }

const log = (funnel, journey, step, seq, account, event, props) => {
  const track = () => {
    if (props) {
      mixpanel.track(event, { funnel, journey, step, seq, ...props })
      return
    }

    mixpanel.track(event, funnel)
  }

  if (!account) {
    track()
    return
  }

  mixpanel.alias(account, undefined, () => {
    track(funnel)
  })
}

const logPremium = (account, coverKey, productKey, dollarValue) => {
  // funnel: Policy Purchase
  mixpanel.alias(account, undefined, () => {
    mixpanel.track(stories.POLICY_PURCHASED, { account, coverKey, productKey, dollarValue })
  })
}

const logAddLiquidity = (account, coverKey, productKey, dollarValue) => {
  // funnel: Liquidity Addition
  mixpanel.alias(account, undefined, () => {
    mixpanel.track(stories.LIQUIDITY_ADDED, { account, coverKey, productKey, dollarValue })
  })
}

const logWalletConnected = (account) => {
  mixpanel.alias(account)
}

export { log, logAddLiquidity, logPremium, logWalletConnected }
