/* eslint-disable unused-imports/no-unused-vars */

const log = async (funnel, journey, step, seq, account, event, props) => {}

const logPageLoad = async (account, path) => { console.log(account, path) }

const logOpenConnectionPopup = async (account) => {}

const logWalletConnected = async (account) => {}

const logWalletDisconnected = async (account) => {}

const logViewAccountOnExplorer = async (account) => {}

const logUnlimitedApprovalToggled = async (account, enabled) => {}

const logCoverProductsSearch = async (account, searchTerm) => {}

const logCoverProductsSort = async (account, sortOrder) => {}

const logCoverProductsViewChanged = async (account, view) => {}

const logPolicyPurchaseRulesAccepted = async (account, coverKey, productKey) => {}

const logPolicyPurchase = async ({ account, coverKey, productKey, coverFee, coverFeeCurrency, protection, protectionCurrency, coveragePeriod, referralCode, tx }) => {}

const logAddLiquidityRulesAccepted = async (account, coverKey) => {}

const logAddLiquidity = async ({ account, coverKey, stake, stakeCurrency, liquidity, liquidityCurrency, tx }) => {}

const logReportIncidentRulesAccepted = async (account, coverKey, productKey) => {}

export {
  log,
  logPageLoad,
  logOpenConnectionPopup,
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
  logReportIncidentRulesAccepted
}
