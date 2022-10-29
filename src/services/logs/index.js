/* eslint-disable unused-imports/no-unused-vars */
import { Analytics } from './analytics'
import * as provider from './providers/amplitude-browser'

const a = new Analytics(provider)

const log = async (funnel, journey, step, seq, account, event, props) => {}

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
    await a.logPolicyPurchaseRulesAccepted(network, account, coverKey, productKey)
  } catch (err) {
    console.log(`Unhandled Error: ${err}`)
  }
}

const logPolicyPurchase = async ({ network, account, coverKey, productKey, coverFee, coverFeeCurrency, protection, protectionCurrency, coveragePeriod, referralCode, tx }) => {
  try {
    await a.logPolicyPurchase({ network, account, coverKey, productKey, coverFee, coverFeeCurrency, protection, protectionCurrency, coveragePeriod, referralCode, tx })
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

const logAddLiquidity = async ({ network, account, coverKey, stake, stakeCurrency, liquidity, liquidityCurrency, tx }) => {
  try {
    await a.logAddLiquidity({ network, account, coverKey, stake, stakeCurrency, liquidity, liquidityCurrency, tx })
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

const logRemoveLiquidity = async ({ network, account, coverKey, stake, stakeCurrency, liquidity, liquidityCurrency, exit, tx }) => {
  try {
    await a.logRemoveLiquidity({ network, account, coverKey, stake, stakeCurrency, liquidity, liquidityCurrency, exit, tx })
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

const logIncidentReported = async ({ network, account, coverKey, productKey, stake, incidentTitle, incidentDescription, incidentProofs, incidentDate, tx }) => {
  try {
    await a.logIncidentReported({ network, account, coverKey, productKey, stake, incidentTitle, incidentDescription, incidentProofs, incidentDate, tx })
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

const logIncidentDisputed = async ({ network, account, coverKey, productKey, stake, disputeTitle, disputeDescription, disputeProofs, tx }) => {
  try {
    await a.logIncidentDisputed({ network, account, coverKey, productKey, stake, disputeTitle, disputeDescription, disputeProofs, tx })
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

const logStakingPoolDepositPopupToggled = async (network, account, poolKey, opened) => {
  try {
    await a.logStakingPoolDepositPopupToggled(network, account, poolKey, opened)
  } catch (err) {
    console.log(`Unhandled Error: ${err}`)
  }
}

const logStakingPoolDeposit = async (network, account, poolKey, stake, stakeCurrency, tx) => {
  try {
    await a.logStakingPoolDeposit(network, account, poolKey, stake, stakeCurrency, tx)
  } catch (err) {
    console.log(`Unhandled Error: ${err}`)
  }
}

const logStakingPoolCollectPopupToggled = async (network, account, poolKey, opened) => {
  try {
    await a.logStakingPoolCollectPopupToggled(network, account, poolKey, opened)
  } catch (err) {
    console.log(`Unhandled Error: ${err}`)
  }
}

const logStakingPoolWithdraw = async (network, account, poolKey, stake, stakeCurrency, tx) => {
  try {
    await a.logStakingPoolWithdraw(network, account, poolKey, stake, stakeCurrency, tx)
  } catch (err) {
    console.log(`Unhandled Error: ${err}`)
  }
}

const logStakingPoolWithdrawRewards = async (network, account, poolKey, tx) => {
  try {
    await a.logStakingPoolWithdrawRewards(network, account, poolKey, tx)
  } catch (err) {
    console.log(`Unhandled Error: ${err}`)
  }
}

export {
  log,
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
