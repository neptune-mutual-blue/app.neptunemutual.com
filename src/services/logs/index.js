/* eslint-disable unused-imports/no-unused-vars */
import { Analytics } from './analytics'
import * as provider from './providers/amplitude-browser'

const a = new Analytics(provider)

const log = async (network, funnel, journey, step, seq, account, event, props) => {
  try {
    await a.log(network, funnel, journey, step, seq, account, event, props)
  } catch (err) {
    console.log(`Unhandled Error: ${err}`)
  }
}

const logPremium = async (network, account, coverKey, productKey, dollarValue) => {
  // funnel: Policy Purchase
  try {
    await a.logPremium(network, account, coverKey, productKey, dollarValue)
  } catch (err) {
    console.log(`Unhandled Error: ${err}`)
  }
}

const logAddLiquidityRevenue = async (network, account, coverKey, productKey, dollarValue) => {
  try {
    await a.logAddLiquidityRevenue(network, account, coverKey, productKey, dollarValue)
  } catch (err) {
    console.log(`Unhandled Error: ${err}`)
  }
}

const logPageLoadWebsite = async (network, pageName = 'index') => {
  try {
    await a.logPageLoadWebsite(network, pageName)
  } catch (err) {
    console.log(`Unhandled Error: ${err}`)
  }
}

const logButtonClick = async (network, buttonName, buttonDescription, eventData = {}, type = 'click') => {
  try {
    await a.logButtonClick(network, buttonName, buttonDescription, eventData, type)
  } catch (err) {
    console.log(`Unhandled Error: ${err}`)
  }
}

const logGesture = async (network, name, description, eventData = {}, type = 'swipe') => {
  try {
    await a.logGesture(network, name, description, eventData, type)
  } catch (err) {
    console.log(`Unhandled Error: ${err}`)
  }
}

const logPageLoad = async (network, account, path) => {
  try {
    await a.logPageLoad(network, account, path)
  } catch (err) {
    console.log(`Unhandled Error: ${err}`)
  }
}

const logOpenExternalPage = async (network, account, path) => {
  try {
    await a.logOpenExternalPage(network, account, path)
  } catch (err) {
    console.log(`Unhandled Error: ${err}`)
  }
}

const logOpenConnectionPopup = async (network, account) => {
  try {
    await a.logOpenConnectionPopup(network, account)
  } catch (err) {
    console.log(`Unhandled Error: ${err}`)
  }
}

const logCloseConnectionPopup = async (network, account) => {
  try {
    await a.logCloseConnectionPopup(network, account)
  } catch (err) {
    console.log(`Unhandled Error: ${err}`)
  }
}

const logWalletConnected = async (network, account) => {
  try {
    await a.logWalletConnected(network, account)
  } catch (err) {
    console.log(`Unhandled Error: ${err}`)
  }
}

const logWalletDisconnected = async (network, account) => {
  try {
    await a.logWalletDisconnected(network, account)
  } catch (err) {
    console.log(`Unhandled Error: ${err}`)
  }
}

const logViewAccountOnExplorer = async (network, account) => {
  try {
    await a.logViewAccountOnExplorer(network, account)
  } catch (err) {
    console.log(`Unhandled Error: ${err}`)
  }
}

const logUnlimitedApprovalToggled = async (network, account, enabled) => {
  try {
    await a.logUnlimitedApprovalToggled(network, account, enabled)
  } catch (err) {
    console.log(`Unhandled Error: ${err}`)
  }
}

const logCoverProductsSearch = async (network, account, searchTerm) => {
  try {
    await a.logCoverProductsSearch(network, account, searchTerm)
  } catch (err) {
    console.log(`Unhandled Error: ${err}`)
  }
}

const logCoverProductsSort = async (network, account, sortOrder) => {
  try {
    await a.logCoverProductsSort(network, account, sortOrder)
  } catch (err) {
    console.log(`Unhandled Error: ${err}`)
  }
}

const logCoverProductsViewChanged = async (network, account, view) => {
  try {
    await a.logCoverProductsViewChanged(network, account, view)
  } catch (err) {
    console.log(`Unhandled Error: ${err}`)
  }
}

const logPolicyPurchaseRulesAccepted = async (network, account, coverKey, productKey) => {
  try {
    await a.logPolicyPurchaseRulesAccepted(network, account, coverKey, productKey ?? null)
  } catch (err) {
    console.log(`Unhandled Error: ${err}`)
  }
}

const logPolicyPurchase = async ({ networkId, network, account, coverKey, productKey, coverName, productName, coverFee, coverFeeCurrency, coverFeeFormatted, sales, salesCurrency, salesFormatted, protection, protectionCurrency, protectionFormatted, coveragePeriod, coveragePeriodFormatted, coveragePeriodMonth, coveragePeriodMonthFormatted, coveragePeriodYear, referralCode, tx }) => {
  try {
    await a.logPolicyPurchase({ network, account, coverKey, productKey, coverName, productName, coverFee, coverFeeCurrency, coverFeeFormatted, sales, salesCurrency, salesFormatted, protection, protectionCurrency, protectionFormatted, coveragePeriod, coveragePeriodFormatted, coveragePeriodMonth, coveragePeriodMonthFormatted, coveragePeriodYear, referralCode, tx })
  } catch (err) {
    console.log(`Unhandled Error: ${err}`)
  }
}

const logAddLiquidityRulesAccepted = async (network, account, coverKey) => {
  try {
    await a.logAddLiquidityRulesAccepted(network, account, coverKey)
  } catch (err) {
    console.log(`Unhandled Error: ${err}`)
  }
}

const logAddLiquidity = async ({ networkId, network, account, coverKey, coverName, sales, salesCurrency, salesFormatted, underwrittenProducts, stake, stakeCurrency, stakeFormatted, pot, potCurrency, potCurrencyFormatted, liquidity, liquidityCurrency, liquidityFormatted, tx, unlockCycleOpen, unlockCycleOpenMonth, unlockCycleOpenMonthFormatted, unlockCycleOpenYear, unlockCycleClose, unlockCycleCloseMonth, unlockCycleCloseMonthFormatted, unlockCycleCloseYear }) => {
  console.log(network, account, coverKey, coverName, sales, salesCurrency, salesFormatted, underwrittenProducts, stake, stakeCurrency, stakeFormatted, pot, potCurrency, potCurrencyFormatted, liquidity, liquidityCurrency, liquidityFormatted, tx, unlockCycleOpen, unlockCycleOpenMonth, unlockCycleOpenMonthFormatted, unlockCycleOpenYear, unlockCycleClose, unlockCycleCloseMonth, unlockCycleCloseMonthFormatted, unlockCycleCloseYear)
  try {
    await a.logAddLiquidity({ network, account, coverKey, coverName, sales, salesCurrency, salesFormatted, underwrittenProducts, stake, stakeCurrency, stakeFormatted, pot, potCurrency, potCurrencyFormatted, liquidity, liquidityCurrency, liquidityFormatted, tx, unlockCycleOpen, unlockCycleOpenMonth, unlockCycleOpenMonthFormatted, unlockCycleOpenYear, unlockCycleClose, unlockCycleCloseMonth, unlockCycleCloseMonthFormatted, unlockCycleCloseYear })
  } catch (err) {
    console.log(`Unhandled Error: ${err}`)
  }
}

const logRemoveLiquidityModalOpen = async (network, account, coverKey) => {
  try {
    await a.logRemoveLiquidityModalOpen(network, account, coverKey)
  } catch (err) {
    console.log(`Unhandled Error: ${err}`)
  }
}

const logRemoveLiquidity = async ({ network, networkId, account, coverName, coverKey, cost, costCurrency, costFormatted, underwrittenProducts, pot, potCurrency, potFormatted, stake, stakeCurrency, stakeFormatted, liquidity, liquidityCurrency, liquidityFormatted, exit, tx }) => {
  try {
    await a.logRemoveLiquidity({ network, networkId, account, coverName, coverKey, cost, costCurrency, costFormatted, underwrittenProducts, pot, potCurrency, potFormatted, stake, stakeCurrency, stakeFormatted, liquidity, liquidityCurrency, liquidityFormatted, exit, tx })
  } catch (err) {
    console.log(`Unhandled Error: ${err}`)
  }
}

const logAccrueLiquidity = async (account, coverKey, tx) => { }

const logReportIncidentRulesAccepted = async (network, account, coverKey, productKey) => {
  try {
    await a.logReportIncidentRulesAccepted(network, account, coverKey, productKey)
  } catch (err) {
    console.log(`Unhandled Error: ${err}`)
  }
}

const logIncidentReportStakeApproved = async (network, account, coverKey, productKey, stake, tx) => {
  try {
    await a.logIncidentReportStakeApproved(network, account, coverKey, productKey, stake, tx)
  } catch (err) {
    console.log(`Unhandled Error: ${err}`)
  }
}

const logIncidentReported = async ({ network, networkId, account, coverKey, coverName, productKey, productName, sales, salesCurrency, salesFormatted, title, observed, observedMonth, observedMonthFormatted, observedYear, proofs, stake, stakeCurrency, stakeFormatted, tx }) => {
  try {
    await a.logIncidentReported({ network, networkId, account, coverKey, coverName, productKey, productName, sales, salesCurrency, salesFormatted, title, observed, observedMonth, observedMonthFormatted, observedYear, proofs, stake, stakeCurrency, stakeFormatted, tx })
  } catch (err) {
    console.log(`Unhandled Error: ${err}`)
  }
}

const logIncidentDisputeStakeApproved = async (network, account, coverKey, productKey, stake, tx) => {
  try {
    await a.logIncidentDisputeStakeApproved(network, account, coverKey, productKey, stake, tx)
  } catch (err) {
    console.log(`Unhandled Error: ${err}`)
  }
}

const logIncidentDisputed = async ({ network, networkId, account, coverKey, coverName, productKey, productName, sales, salesCurrency, salesFormatted, title, proofs, stake, stakeCurrency, stakeFormatted, tx }) => {
  try {
    await a.logIncidentDisputed({ network, networkId, account, coverKey, coverName, productKey, productName, sales, salesCurrency, salesFormatted, title, proofs, stake, stakeCurrency, stakeFormatted, tx })
  } catch (err) {
    console.log(`Unhandled Error: ${err}`)
  }
}

const logBondLpTokenApproval = async (network, account, lpTokenAmount, tx) => {
  try {
    await a.logBondLpTokenApproval(network, account, lpTokenAmount, tx)
  } catch (err) {
    console.log(`Unhandled Error: ${err}`)
  }
}

const logBondCreated = async (network, account, lpTokenAmount, receiveAmount, tx) => {
  try {
    await a.logBondCreated(network, account, lpTokenAmount, receiveAmount, tx)
  } catch (err) {
    console.log(`Unhandled Error: ${err}`)
  }
}

const logBondClaimed = async (network, account, tx) => {
  try {
    await a.logBondClaimed(network, account, tx)
  } catch (err) {
    console.log(`Unhandled Error: ${err}`)
  }
}

const logCoverProductRulesDownload = async (network, account, coverKey, productKey) => {
  try {
    await a.logCoverProductRulesDownload(network, account, coverKey, productKey)
  } catch (err) {
    console.log(`Unhandled Error: ${err}`)
  }
}

const logStakingPoolDepositPopupToggled = async (network, account, poolName, poolkey, opened) => {
  try {
    await a.logStakingPoolDepositPopupToggled(network, account, poolName, poolkey, opened)
  } catch (err) {
    console.log(`Unhandled Error: ${err}`)
  }
}

const logStakingPoolDeposit = async (network, account, poolName, poolkey, stake, stakeCurrency, tx) => {
  try {
    await a.logStakingPoolDeposit(network, account, poolName, poolkey, stake, stakeCurrency, tx)
  } catch (err) {
    console.log(`Unhandled Error: ${err}`)
  }
}

const logStakingPoolCollectPopupToggled = async (network, account, poolName, poolkey, opened) => {
  try {
    await a.logStakingPoolCollectPopupToggled(network, account, poolName, poolkey, opened)
  } catch (err) {
    console.log(`Unhandled Error: ${err}`)
  }
}

const logStakingPoolWithdraw = async (network, account, poolName, poolkey, stake, stakeCurrency, tx) => {
  try {
    await a.logStakingPoolWithdraw(network, account, poolName, poolkey, stake, stakeCurrency, tx)
  } catch (err) {
    console.log(`Unhandled Error: ${err}`)
  }
}

const logStakingPoolWithdrawRewards = async (network, account, poolName, poolkey, tx) => {
  try {
    await a.logStakingPoolWithdrawRewards(network, account, poolName, poolkey, tx)
  } catch (err) {
    console.log(`Unhandled Error: ${err}`)
  }
}

export {
  log,
  logPremium,
  logAddLiquidityRevenue,
  logPageLoadWebsite,
  logButtonClick,
  logGesture,
  logPageLoad,
  logOpenExternalPage,
  logOpenConnectionPopup,
  logCloseConnectionPopup,
  logWalletConnected,
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
  logAccrueLiquidity,
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
