/* eslint-disable unused-imports/no-unused-vars */

const log = async (funnel, journey, step, seq, account, event, props) => {}

const logPageLoad = async (account, path) => {}

const logOpenExternalPage = async (account, path) => {}

const logOpenConnectionPopup = async (account) => {}

const logCloseConnectionPopup = async (account) => {}

const logWalletConnected = async (account) => {}

const logWalletDisconnected = async (account) => {}

const logViewAccountOnExplorer = async (account) => {}

const logUnlimitedApprovalToggled = async (account, enabled) => {}

const logCoverProductsSearch = async (account, searchTerm) => {}

const logCoverProductsSort = async (account, sortOrder) => {}

const logCoverProductsViewChanged = async (account, view) => {}

const logPolicyPurchaseRulesAccepted = async (account, coverKey, productKey) => {}

const logPolicyPurchase = async ({ account, coverKey, productKey, coverFee, coverFeeCurrency, protection, protectionCurrency, coveragePeriod, referralCode, tx }) => {}

const logAddLiquidityRulesAccepted = async (account, coverKey) => { }

const logAddLiquidity = async ({ account, coverKey, stake, stakeCurrency, liquidity, liquidityCurrency, tx }) => { }

const logRemoveLiquidityModalOpen = async (account, coverKey) => { }

const logRemoveLiquidity = async ({ account, coverKey, stake, stakeCurrency, liquidity, liquidityCurrency, exit, tx }) => { }

const logAccrueLiquidity = async (account, coverKey, tx) => { }

const logReportIncidentRulesAccepted = async (account, coverKey, productKey) => { }

const logIncidentReportStakeApproved = async (account, coverKey, productKey, stake, tx) => { }

const logIncidentReported = async ({ account, coverKey, productKey, stake, incidentTitle, incidentDescription, incidentProofs, incidentDate, tx }) => { }

const logIncidentDisputeStakeApproved = async (account, coverKey, productKey, stake, tx) => { console.log(account, coverKey, productKey, stake, tx) }

const logIncidentDisputed = async ({ account, coverKey, productKey, stake, disputeTitle, disputeDescription, disputeProofs, tx }) => { }

const logBondLpTokenApproval = async (account, lpTokenAmount, tx) => { }

const logBondCreated = async (account, lpTokenAmount, receiveAmount, tx) => { }

const logBondClaimed = async (account, tx) => { }

const logCoverProductRulesDownload = async (account, coverKey, productKey) => { }

const logStakingPoolDepositPopupToggled = async (account, poolKey, opened) => { }

const logStakingPoolDeposit = async (account, poolKey, stake, stakeCurrency, tx) => { }

const logStakingPoolCollectPopupToggled = async (account, poolKey, opened) => { }

const logStakingPoolWithdraw = async (account, poolKey, stake, stakeCurrency, tx) => { }

const logStakingPoolWithdrawRewards = async (account, poolKey, tx) => { }

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
