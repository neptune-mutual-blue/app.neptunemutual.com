import { getNetworkId, mainnetChainIds } from '@/src/config/environment'
import * as amplitude from '@amplitude/analytics-browser'

let networkId
if (typeof window !== 'undefined') {
  networkId = getNetworkId()
}

const isMainnet = mainnetChainIds.indexOf(networkId) > -1

const apiKey = isMainnet ? process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY_MAINNET : process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY_TESTNET

const events = {
  PREMIUM: 'PREMIUM',
  LIQUIDITY: 'LIQUIDITY'
}

let initialized = false

const registerUser = (network, account) => {
  try {
    const identifyObj = new amplitude.Identify()
    identifyObj.setOnce('network', network)
    identifyObj.setOnce('account', account)

    amplitude.identify(identifyObj)
  } catch (e) {
    console.log('Error in creating user...')
  }
}

const init = async (option) => {
  option = option || {}

  if (initialized) return

  try {
    await amplitude.init(apiKey, null, {
      // serverUrl: new URL(process.env.NEXT_PUBLIC_AMPLITUDE_SERVER_URL).toString(),
      serverZone: amplitude.Types.ServerZone.US,
      ...option
    }).promise
    initialized = true
  } catch (e) {
    initialized = false
  }
}

const log = async (network, funnel, journey, step, seq, account, event, props = {}) => {
  init({}, account)

  if (props) {
    amplitude.track(event, { network, funnel, journey, step, seq, ...props })
    return
  }

  amplitude.track(event)
}

const logPremium = (account, coverKey, productKey, dollarValue) => {
  // funnel: Policy Purchase
  // journey: Purchase-Policy-Page-2
  // sequence: 9999
  // event: 'Closed/Won'

  init({}, account)

  const productId = productKey ? `${coverKey}/${productKey}` : coverKey

  amplitude.revenue(new amplitude.Revenue()
    .setProductId(productId)
    .setRevenueType(events.PREMIUM)
    .setPrice(dollarValue)
    .setQuantity(1)
  )
}

const logAddLiquidityRevenue = (account, coverKey, productKey, dollarValue) => {
  // funnel: Liquidity Addition
  // journey: Add-Liquidity-Page-2
  // sequence: 9999
  // event: 'Closed/Won'

  init({}, account)

  const productId = productKey ? `${coverKey}/${productKey}` : coverKey

  amplitude.revenue(new amplitude.Revenue()
    .setProductId(productId)
    .setRevenueType(events.LIQUIDITY)
    .setPrice(dollarValue))
}

const logPageLoadWebsite = (network, pageName = 'index') => {
  init()

  const eventName = 'page-load'

  try {
    amplitude.track(eventName, {
      network,
      pageName
    })
  } catch (e) {
    console.log(`Error in logging ${eventName} event: `, e)
  }
}

const logButtonClick = (network, buttonName, buttonDescription, eventData = {}, type = 'click') => {
  init()

  const eventName = `${buttonName} click`

  try {
    amplitude.track(eventName, {
      network,
      buttonName,
      buttonDescription,
      type,
      ...eventData
    })
  } catch (e) {
    console.log(`Error in logging ${eventName} event: `, e)
  }
}

const logGesture = (network, name, description, eventData = {}, type = 'swipe') => {
  init()

  const eventName = `${name} ${type}`

  try {
    amplitude.track(eventName, {
      network,
      name,
      description,
      type,
      ...eventData
    })
  } catch (e) {
    console.log(`Error in logging ${eventName} event: `, e)
  }
}

const logPageLoad = (network, account = 'N/A', path) => {
  init()

  const eventName = 'page-load'
  try {
    amplitude.track(eventName, {
      network,
      account,
      path
    })
  } catch (e) {
    console.log(`Error in logging ${eventName} event: `, e)
  }
}

const logOpenExternalPage = (network, account = 'N/A', path) => {
  init()

  const eventName = 'open-external-page'

  try {
    amplitude.track(eventName, {
      network,
      account,
      path
    })
  } catch (e) {
    console.log(`Error in logging ${eventName} event: `, e)
  }
}

const logOpenConnectionPopup = (network, account = 'N/A') => {
  init()

  const eventName = 'open-connection-popup'

  try {
    amplitude.track(eventName, {
      network,
      account
    })
  } catch (e) {
    console.log(`Error in logging ${eventName} event: `, e)
  }
}

const logCloseConnectionPopup = (network, account = 'N/A') => {
  init()

  const eventName = 'close-connection-popup'

  try {
    amplitude.track(eventName, {
      network,
      account
    })
  } catch (e) {
    console.log(`Error in logging ${eventName} event: `, e)
  }
}

const logWalletConnected = (network, account) => {
  init()
  registerUser(account)

  const eventName = 'wallet-connected'

  try {
    amplitude.track(eventName, {
      network,
      account
    })
  } catch (e) {
    console.log(`Error in logging ${eventName} event: `, e)
  }
}

const logWalletDisconnected = (network, account) => {
  init()

  const eventName = 'wallet-disconnected'

  try {
    amplitude.track(eventName, {
      network,
      account
    })
  } catch (e) {
    console.log(`Error in logging ${eventName} event: `, e)
  }
}

const logViewAccountOnExplorer = (network, account) => {
  init()

  const eventName = 'view-account-on-explorer'

  try {
    amplitude.track(eventName, {
      network,
      account
    })
  } catch (e) {
    console.log(`Error in logging ${eventName} event: `, e)
  }
}

const logUnlimitedApprovalToggled = (network, account, enabled) => {
  init()

  const eventName = 'unlimited-approval-toggled'

  try {
    amplitude.track(eventName, {
      network,
      account,
      enabled
    })
  } catch (e) {
    console.log(`Error in logging ${eventName} event: `, e)
  }
}

const logCoverProductsSearch = (network, account = 'N/A', searchTerm) => {
  init()

  const eventName = 'cover-products-search'

  try {
    amplitude.track(eventName, {
      network,
      account,
      searchTerm
    })
  } catch (e) {
    console.log(`Error in logging ${eventName} event: `, e)
  }
}

const logCoverProductsSort = (network, account = 'N/A', sortOrder) => {
  init()

  const eventName = 'cover-products-sort'

  try {
    amplitude.track(eventName, {
      network,
      account,
      sortOrder
    })
  } catch (e) {
    console.log(`Error in logging ${eventName} event: `, e)
  }
}

const logCoverProductsViewChanged = (network, account = 'N/A', view) => {
  init()

  const eventName = 'cover-products-view-changed'

  try {
    amplitude.track(eventName, {
      network,
      account,
      view
    })
  } catch (e) {
    console.log(`Error in logging ${eventName} event: `, e)
  }
}

const logPolicyPurchaseRulesAccepted = (network, account = 'N/A', coverKey, productKey) => {
  init()

  const eventName = 'policy-purchase-rules-accepted'

  try {
    amplitude.track(eventName, {
      network,
      account,
      coverKey,
      productKey
    })
  } catch (e) {
    console.log(`Error in logging ${eventName} event: `, e)
  }
}

const logPolicyPurchase = ({ networkId, network, account, coverKey, productKey, coverName, productName, coverFee, coverFeeCurrency, coverFeeFormatted, sales, salesCurrency, salesFormatted, protection, protectionCurrency, protectionFormatted, coveragePeriod, coveragePeriodFormatted, coveragePeriodMonth, coveragePeriodMonthFormatted, coveragePeriodYear, referralCode, tx }) => {
  init()

  const eventName = 'policy-purchased'

  try {
    amplitude.track(eventName, {
      networkId,
      network,
      account,
      coverKey,
      coverName,
      productKey,
      productName,
      details: {
        coverFee,
        coverFeeCurrency,
        coverFeeFormatted,
        sales,
        salesCurrency,
        salesFormatted,
        protection,
        protectionCurrency,
        protectionFormatted,
        coveragePeriod,
        coveragePeriodFormatted,
        coveragePeriodMonth,
        coveragePeriodMonthFormatted,
        coveragePeriodYear,
        referralCode,
        tx
      }
    })
  } catch (e) {
    console.log(`Error in logging ${eventName} event: `, e)
  }
}

const logAddLiquidityRulesAccepted = (network, account = 'N/A', coverKey) => {
  init()

  const eventName = 'add-liquidity-rules-accepted'

  try {
    amplitude.track(eventName, {
      network,
      account,
      coverKey
    })
  } catch (e) {
    console.log(`Error in logging ${eventName} event: `, e)
  }
}

const logAddLiquidity = ({
  networkId,
  network,
  account,
  coverKey,
  coverName,
  sales,
  salesCurrency,
  salesFormatted,
  underwrittenProducts,
  stake,
  stakeCurrency,
  stakeFormatted,
  pot,
  potCurrency,
  potCurrencyFormatted,
  liquidity,
  liquidityCurrency,
  liquidityFormatted,
  tx,
  unlockCycleOpen,
  unlockCycleOpenMonth,
  unlockCycleOpenMonthFormatted,
  unlockCycleOpenYear,
  unlockCycleClose,
  unlockCycleCloseMonth,
  unlockCycleCloseMonthFormatted,
  unlockCycleCloseYear
}) => {
  init()

  const eventName = 'liquidity-added'

  try {
    amplitude.track(eventName, {
      networkId,
      network,
      account,
      coverKey,
      coverName,
      details: {
        stake,
        stakeCurrency,
        stakeFormatted,
        liquidity,
        liquidityFormatted,
        liquidityCurrency,
        sales,
        salesCurrency,
        salesFormatted,
        underwrittenProducts,
        pot,
        potCurrency,
        potCurrencyFormatted,
        unlockCycleOpen,
        unlockCycleOpenMonth,
        unlockCycleOpenMonthFormatted,
        unlockCycleOpenYear,
        unlockCycleClose,
        unlockCycleCloseMonth,
        unlockCycleCloseMonthFormatted,
        unlockCycleCloseYear,
        tx
      }
    })
  } catch (e) {
    console.log(`Error in logging ${eventName} event: `, e)
  }
}

const logRemoveLiquidityModalOpen = (network, account, coverKey) => {
  init()

  const eventName = 'remove-liquidity-modal-open'

  try {
    amplitude.track(eventName, {
      network,
      account,
      coverKey
    })
  } catch (e) {
    console.log(`Error in logging ${eventName} event: `, e)
  }
}

const logRemoveLiquidity = ({ network, networkId, account, coverName, coverKey, cost, costCurrency, costFormatted, underwrittenProducts, pot, potCurrency, potFormatted, stake, stakeCurrency, stakeFormatted, liquidity, liquidityCurrency, liquidityFormatted, exit, tx }) => {
  init()

  const eventName = 'liquidity-removed'

  try {
    amplitude.track(eventName, {
      network,
      networkId,
      account,
      coverKey,
      coverName,
      details: {
        cost,
        costCurrency,
        costFormatted,
        underwrittenProducts,
        pot,
        potCurrency,
        potFormatted,
        stake,
        stakeCurrency,
        stakeFormatted,
        liquidity,
        liquidityCurrency,
        liquidityFormatted,
        exit,
        tx
      }
    })
  } catch (e) {
    console.log(`Error in logging ${eventName} event: `, e)
  }
}

const logReportIncidentRulesAccepted = (network, account = 'N/A', coverKey, productKey) => {
  init()

  const eventName = 'report-incident-rules-accepted'

  try {
    amplitude.track(eventName, {
      network,
      account,
      coverKey,
      productKey
    })
  } catch (e) {
    console.log(`Error in logging ${eventName} event: `, e)
  }
}

const logIncidentReportStakeApproved = (network, account, coverKey, productKey, stake, tx) => {
  init()

  const eventName = 'incident-report-stake-approved'

  try {
    amplitude.track(eventName, {
      network,
      account,
      coverKey,
      productKey,
      stake,
      tx
    })
  } catch (e) {
    console.log(`Error in logging ${eventName} event: `, e)
  }
}

const logIncidentReported = ({ network, networkId, account, coverKey, coverName, productKey, productName, sales, salesCurrency, salesFormatted, title, observed, observedMonth, observedMonthFormatted, observedYear, proofs, stake, stakeCurrency, stakeFormatted, tx }) => {
  init()

  const eventName = 'incident-reported'

  try {
    amplitude.track(eventName, {
      network,
      networkId,
      account,
      coverKey,
      coverName,
      productKey,
      productName,
      details: {
        sales,
        salesCurrency,
        salesFormatted,
        title,
        observed,
        observedMonth,
        observedMonthFormatted,
        observedYear,
        proofs,
        stake,
        stakeCurrency,
        stakeFormatted,
        tx
      }
    })
  } catch (e) {
    console.log(`Error in logging ${eventName} event: `, e)
  }
}

const logIncidentDisputeStakeApproved = (network, account, coverKey, productKey, stake, tx) => {
  init()

  const eventName = 'incident-dispute-stake-approved'

  try {
    amplitude.track(eventName, {
      network,
      account,
      coverKey,
      productKey,
      stake,
      tx
    })
  } catch (e) {
    console.log(`Error in logging ${eventName} event: `, e)
  }
}

const logIncidentDisputed = ({ network, networkId, account, coverKey, coverName, productKey, productName, sales, salesCurrency, salesFormatted, title, proofs, stake, stakeCurrency, stakeFormatted, tx }) => {
  init()

  const eventName = 'incident-disputed'

  try {
    amplitude.track(eventName, {
      network,
      networkId,
      account,
      coverKey,
      coverName,
      productKey,
      productName,
      details: {
        sales,
        salesCurrency,
        salesFormatted,
        title,
        proofs,
        stake,
        stakeCurrency,
        stakeFormatted,
        tx
      }
    })
  } catch (e) {
    console.log(`Error in logging ${eventName} event: `, e)
  }
}

const logBondLpTokenApproval = (network, account, lpTokenAmount, tx) => {
  init()

  const eventName = 'bond-lp-token-approved'

  try {
    amplitude.track(eventName, {
      network,
      account,
      lpTokenAmount,
      tx
    })
  } catch (e) {
    console.log(`Error in logging ${eventName} event: `, e)
  }
}

const logBondCreated = (network, account, lpTokenAmount, receiveAmount, tx) => {
  init()

  const eventName = 'bond-created'

  try {
    amplitude.track(eventName, {
      network,
      account,
      lpTokenAmount,
      receiveAmount,
      tx
    })
  } catch (e) {
    console.log(`Error in logging ${eventName} event: `, e)
  }
}

const logBondClaimed = (network, account, tx) => {
  init()

  const eventName = 'bond-claimed'

  try {
    amplitude.track(eventName, {
      network,
      account,
      tx
    })
  } catch (e) {
    console.log(`Error in logging ${eventName} event: `, e)
  }
}

const logCoverProductRulesDownload = (network, account = 'N/A', coverKey, productKey) => {
  init()

  const eventName = 'cover-product-rules-downloaded'

  try {
    amplitude.track(eventName, {
      network,
      account,
      coverKey,
      productKey
    })
  } catch (e) {
    console.log(`Error in logging ${eventName} event: `, e)
  }
}

const logStakingPoolDepositPopupToggled = (network, account, poolName, poolKey, opened) => {
  init()

  const eventName = 'staking-pool-deposit-popup-toggled'

  try {
    amplitude.track(eventName, {
      network,
      account,
      poolName,
      poolKey,
      opened
    })
  } catch (e) {
    console.log(`Error in logging ${eventName} event: `, e)
  }
}

const logStakingPoolDeposit = (network, account, poolName, poolKey, stake, stakeCurrency, tx) => {
  init()

  const eventName = 'staking-pool-deposited'

  try {
    amplitude.track(eventName, {
      network,
      account,
      poolName,
      poolKey,
      stake,
      stakeCurrency,
      tx
    })
  } catch (e) {
    console.log(`Error in logging ${eventName} event: `, e)
  }
}

const logStakingPoolCollectPopupToggled = (network, account, poolName, poolKey, opened) => {
  init()

  const eventName = 'staking-pool-collect-popup-toggled'

  try {
    amplitude.track(eventName, {
      network,
      account,
      poolName,
      poolKey,
      opened
    })
  } catch (e) {
    console.log(`Error in logging ${eventName} event: `, e)
  }
}

const logStakingPoolWithdraw = (network, account, poolName, poolKey, stake, stakeCurrency, tx) => {
  init()

  const eventName = 'staking-pool-withdrawn'

  try {
    amplitude.track(eventName, {
      network,
      account,
      poolName,
      poolKey,
      details: {
        stake,
        stakeCurrency,
        tx
      }
    })
  } catch (e) {
    console.log(`Error in logging ${eventName} event: `, e)
  }
}

const logStakingPoolWithdrawRewards = (network, account, poolName, poolKey, tx) => {
  init()

  const eventName = 'staking-pool-rewards-withdrawn'

  try {
    amplitude.track(eventName, {
      network,
      account,
      poolName,
      poolKey,
      tx
    })
  } catch (e) {
    console.log(`Error in logging ${eventName} event: `, e)
  }
}

export {
  log,
  logAddLiquidityRevenue,
  logPremium,
  logWalletConnected,
  logPageLoadWebsite,
  logButtonClick,
  logGesture,
  logPageLoad,
  logOpenExternalPage,
  logOpenConnectionPopup,
  logCloseConnectionPopup,
  logWalletDisconnected,
  logViewAccountOnExplorer,
  logUnlimitedApprovalToggled,
  logCoverProductsSearch,
  logCoverProductsSort,
  logCoverProductsViewChanged,
  logPolicyPurchaseRulesAccepted,
  logPolicyPurchase,
  logAddLiquidityRulesAccepted,
  logAddLiquidity,
  logRemoveLiquidityModalOpen,
  logRemoveLiquidity,
  logReportIncidentRulesAccepted,
  logIncidentReportStakeApproved,
  logIncidentReported,
  logIncidentDisputeStakeApproved,
  logIncidentDisputed,
  logBondLpTokenApproval,
  logBondCreated,
  logBondClaimed,
  logCoverProductRulesDownload,
  logStakingPoolDepositPopupToggled,
  logStakingPoolDeposit,
  logStakingPoolCollectPopupToggled,
  logStakingPoolWithdraw,
  logStakingPoolWithdrawRewards
}
