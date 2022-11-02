export class Analytics {
  constructor (provider) {
    this.provider = provider
  }

  async init (options) {
    try {
      await this.provider.init(options)
    } catch (error) {
      console.error('Unhandled Error', error)
    }
  }

  async log (network, funnel, journey, step, seq, account, e, props) {
    try {
      await this.provider.log(network, funnel, journey, step, seq, account, e, props)
    } catch (error) {
      console.error('Unhandled Error', error)
    }
  }

  async logPremium (account, coverKey, productKey, dollarValue) {
    try {
      await this.provider.logPremium(account, coverKey, productKey, dollarValue)
    } catch (error) {
      console.error(error)
    }
  }

  async logAddLiquidityRevenue (network, account, coverKey, productKey, dollarValue) {
    try {
      this.provider.logAddLiquidityRevenue(network, account, coverKey, productKey, dollarValue)
    } catch (error) {
      console.error('Unhandled Error', error)
    }
  }

  async logPageLoadWebsite (network, pageName = 'index') {
    try {
      this.provider.logPageLoadWebsite(network, pageName)
    } catch (error) {
      console.error('Unhandled Error', error)
    }
  }

  async logButtonClick (network, buttonName, buttonDescription, eventData = {}, type = 'click') {
    try {
      this.provider.logButtonClick(network, buttonName, buttonDescription, eventData, type)
    } catch (error) {
      console.error('Unhandled Error', error)
    }
  }

  async logGesture (network, name, description, eventData = {}, type = 'swipe') {
    try {
      this.provider.logGesture(network, name, description, eventData, type)
    } catch (error) {
      console.error('Unhandled Error', error)
    }
  }

  async logPageLoad (network, account = 'N/A', path) {
    try {
      this.provider.logPageLoad(network, account, path)
    } catch (error) {
      console.error('Unhandled Error', error)
    }
  }

  async logOpenExternalPage (network, account = 'N/A', path) {
    try {
      this.provider.logOpenExternalPage(network, account, path)
    } catch (error) {
      console.error('Unhandled Error', error)
    }
  }

  async logOpenConnectionPopup (network, account = 'N/A') {
    try {
      this.provider.logOpenConnectionPopup(network, account)
    } catch (error) {
      console.error('Unhandled Error', error)
    }
  }

  async logCloseConnectionPopup (network, account = 'N/A') {
    try {
      this.provider.logCloseConnectionPopup(network, account)
    } catch (error) {
      console.error('Unhandled Error', error)
    }
  }

  async logWalletConnected (network, account) {
    try {
      this.provider.logWalletConnected(network, account)
    } catch (error) {
      console.error('Unhandled Error', error)
    }
  }

  async logWalletDisconnected (network, account) {
    try {
      this.provider.logWalletDisconnected(network, account)
    } catch (error) {
      console.error('Unhandled Error', error)
    }
  }

  async logViewAccountOnExplorer (network, account) {
    try {
      this.provider.logViewAccountOnExplorer(network, account)
    } catch (error) {
      console.error('Unhandled Error', error)
    }
  }

  async logUnlimitedApprovalToggled (network, account, enabled) {
    try {
      this.provider.logUnlimitedApprovalToggled(network, account, enabled)
    } catch (error) {
      console.error('Unhandled Error', error)
    }
  }

  async logCoverProductsSearch (network, account = 'N/A', searchTerm) {
    try {
      this.provider.logCoverProductsSearch(network, account, searchTerm)
    } catch (error) {
      console.error('Unhandled Error', error)
    }
  }

  async logCoverProductsSort (network, account = 'N/A', sortOrder) {
    try {
      this.provider.logCoverProductsSort(network, account, sortOrder)
    } catch (error) {
      console.error('Unhandled Error', error)
    }
  }

  async logCoverProductsViewChanged (network, account = 'N/A', view) {
    try {
      this.provider.logCoverProductsViewChanged(network, account, view)
    } catch (error) {
      console.error('Unhandled Error', error)
    }
  }

  async logPolicyPurchaseRulesAccepted (network, account = 'N/A', coverKey, productKey) {
    try {
      this.provider.logPolicyPurchaseRulesAccepted(network, account, coverKey, productKey)
    } catch (error) {
      console.error('Unhandled Error', error)
    }
  }

  async logPolicyPurchase ({ networkId, network, account, coverKey, productKey, coverName, productName, coverFee, coverFeeCurrency, coverFeeFormatted, sales, salesCurrency, salesFormatted, protection, protectionCurrency, protectionFormatted, coveragePeriod, coveragePeriodFormatted, coveragePeriodMonth, coveragePeriodMonthFormatted, coveragePeriodYear, referralCode, tx }) {
    try {
      this.provider.logPolicyPurchase({ networkId, network, account, coverKey, productKey, coverName, productName, coverFee, coverFeeCurrency, coverFeeFormatted, sales, salesCurrency, salesFormatted, protection, protectionCurrency, protectionFormatted, coveragePeriod, coveragePeriodFormatted, coveragePeriodMonth, coveragePeriodMonthFormatted, coveragePeriodYear, referralCode, tx })
    } catch (error) {
      console.error('Unhandled Error', error)
    }
  }

  async logAddLiquidityRulesAccepted (network, account = 'N/A', coverKey) {
    try {
      this.provider.logAddLiquidityRulesAccepted(network, account, coverKey)
    } catch (error) {
      console.error('Unhandled Error', error)
    }
  }

  async logAddLiquidity ({ networkId, network, account, coverKey, coverName, sales, salesCurrency, salesFormatted, underwrittenProducts, stake, stakeCurrency, stakeFormatted, pot, potCurrency, potCurrencyFormatted, liquidity, liquidityCurrency, liquidityFormatted, tx, unlockCycleOpen, unlockCycleOpenMonth, unlockCycleOpenMonthFormatted, unlockCycleOpenYear, unlockCycleClose, unlockCycleCloseMonth, unlockCycleCloseMonthFormatted, unlockCycleCloseYear }) {
    try {
      this.provider.logAddLiquidity({ networkId, network, account, coverKey, coverName, sales, salesCurrency, salesFormatted, underwrittenProducts, stake, stakeCurrency, stakeFormatted, pot, potCurrency, potCurrencyFormatted, liquidity, liquidityCurrency, liquidityFormatted, tx, unlockCycleOpen, unlockCycleOpenMonth, unlockCycleOpenMonthFormatted, unlockCycleOpenYear, unlockCycleClose, unlockCycleCloseMonth, unlockCycleCloseMonthFormatted, unlockCycleCloseYear })
    } catch (error) {
      console.error('Unhandled Error', error)
    }
  }

  async logRemoveLiquidityModalOpen (network, account, coverKey) {
    try {
      this.provider.logRemoveLiquidityModalOpen(network, account, coverKey)
    } catch (error) {
      console.error('Unhandled Error', error)
    }
  }

  async logRemoveLiquidity ({ network, networkId, account, coverName, coverKey, cost, costCurrency, costFormatted, underwrittenProducts, pot, potCurrency, potFormatted, stake, stakeCurrency, stakeFormatted, liquidity, liquidityCurrency, liquidityFormatted, exit, tx }) {
    try {
      this.provider.logRemoveLiquidity({ network, networkId, account, coverName, coverKey, cost, costCurrency, costFormatted, underwrittenProducts, pot, potCurrency, potFormatted, stake, stakeCurrency, stakeFormatted, liquidity, liquidityCurrency, liquidityFormatted, exit, tx })
    } catch (error) {
      console.error('Unhandled Error', error)
    }
  }

  async logReportIncidentRulesAccepted (network, account = 'N/A', coverKey, productKey) {
    try {
      this.provider.logReportIncidentRulesAccepted(network, account, coverKey, productKey)
    } catch (error) {
      console.error('Unhandled Error', error)
    }
  }

  async logIncidentReportStakeApproved (network, account, coverKey, productKey, stake, tx) {
    try {
      this.provider.logIncidentReportStakeApproved(network, account, coverKey, productKey, stake, tx)
    } catch (error) {
      console.error('Unhandled Error', error)
    }
  }

  async logIncidentReported ({ network, networkId, account, coverKey, coverName, productKey, productName, sales, salesCurrency, salesFormatted, title, observed, observedMonth, observedMonthFormatted, observedYear, proofs, stake, stakeCurrency, stakeFormatted, tx }) {
    try {
      this.provider.logIncidentReported({ network, networkId, account, coverKey, coverName, productKey, productName, sales, salesCurrency, salesFormatted, title, observed, observedMonth, observedMonthFormatted, observedYear, proofs, stake, stakeCurrency, stakeFormatted, tx })
    } catch (error) {
      console.error('Unhandled Error', error)
    }
  }

  async logIncidentDisputeStakeApproved (network, account, coverKey, productKey, stake, tx) {
    try {
      this.provider.logIncidentDisputeStakeApproved(network, account, coverKey, productKey, stake, tx)
    } catch (error) {
      console.error('Unhandled Error', error)
    }
  }

  async logIncidentDisputed ({ network, networkId, account, coverKey, coverName, productKey, productName, sales, salesCurrency, salesFormatted, title, proofs, stake, stakeCurrency, stakeFormatted, tx }) {
    try {
      this.provider.logIncidentDisputed({ network, networkId, account, coverKey, coverName, productKey, productName, sales, salesCurrency, salesFormatted, title, proofs, stake, stakeCurrency, stakeFormatted, tx })
    } catch (error) {
      console.error('Unhandled Error', error)
    }
  }

  async logUnstakeReportingRewards ({ network, networkId, coverKey, coverName, productKey, productName, sales, salesCurrency, salesFormatted, account, tx, stake, stakeCurrency, stakeFormatted, camp, withClaim }) {
    try {
      this.provider.logUnstakeReportingRewards({ network, networkId, coverKey, coverName, productKey, productName, sales, salesCurrency, salesFormatted, account, tx, stake, stakeCurrency, stakeFormatted, camp, withClaim })
    } catch (error) {
      console.error('Unhandled Error', error)
    }
  }

  async logClaimCover ({ network, networkId, coverKey, coverName, productKey, productName, cost, costCurrency, costFormatted, account, tx, claim, claimCurrency, claimFormatted, fee, feeFormatted }) {
    try {
      this.provider.logClaimCover({ network, networkId, coverKey, coverName, productKey, productName, cost, costCurrency, costFormatted, account, tx, claim, claimCurrency, claimFormatted, fee, feeFormatted })
    } catch (error) {
      console.error('Unhandled Error', error)
    }
  }

  async logBondLpTokenApproval (network, account, lpTokenAmount, tx) {
    try {
      this.provider.logBondLpTokenApproval(network, account, lpTokenAmount, tx)
    } catch (error) {
      console.error('Unhandled Error', error)
    }
  }

  async logBondCreated ({ network, networkId, account, sales, salesCurrency, salesFormatted, bond, bondCurrency, bondFormatted, allocation, allocationCurrency, allocationFormatted, unlockPeriod, unlockPeriodFormatted, unlock, unlockMonth, unlockMonthformatted, unlockYear, tx }) {
    try {
      this.provider.logBondCreated({ network, networkId, account, sales, salesCurrency, salesFormatted, bond, bondCurrency, bondFormatted, allocation, allocationCurrency, allocationFormatted, unlockPeriod, unlockPeriodFormatted, unlock, unlockMonth, unlockMonthformatted, unlockYear, tx })
    } catch (error) {
      console.error('Unhandled Error', error)
    }
  }

  async logBondClaimed ({ network, networkId, sales, salesCurrency, salesFormatted, account, tx, allocation, allocationCurrency, allocationFormatted }) {
    try {
      this.provider.logBondClaimed({ network, networkId, sales, salesCurrency, salesFormatted, account, tx, allocation, allocationCurrency, allocationFormatted })
    } catch (error) {
      console.error('Unhandled Error', error)
    }
  }

  async logCoverProductRulesDownload (network, account = 'N/A', coverKey, productKey) {
    try {
      this.provider.logCoverProductRulesDownload(network, account, coverKey, productKey)
    } catch (error) {
      console.error('Unhandled Error', error)
    }
  }

  async logStakingPoolDepositPopupToggled (network, account, poolName, poolKey, opened) {
    try {
      this.provider.logStakingPoolDepositPopupToggled(network, account, poolName, poolKey, opened)
    } catch (error) {
      console.error('Unhandled Error', error)
    }
  }

  async logStakingPoolDeposit ({ network, networkId, sales, salesCurrency, salesFormatted, account, tx, type, poolKey, poolName, stake, stakeCurrency, stakeFormatted, lockupPeriod, lockupPeriodFormatted, withdrawStartHeight }) {
    try {
      this.provider.logStakingPoolDeposit({ network, networkId, sales, salesCurrency, salesFormatted, account, tx, type, poolKey, poolName, stake, stakeCurrency, stakeFormatted, lockupPeriod, lockupPeriodFormatted, withdrawStartHeight })
    } catch (error) {
      console.error('Unhandled Error', error)
    }
  }

  async logStakingPoolCollectPopupToggled (network, account, poolName, poolKey, opened) {
    try {
      this.provider.logStakingPoolCollectPopupToggled(network, account, poolName, poolKey, opened)
    } catch (error) {
      console.error('Unhandled Error', error)
    }
  }

  async logStakingPoolWithdraw ({ network, networkId, sales, salesCurrency, salesFormatted, account, tx, poolKey, poolName, withdrawal, withdrawalCurrency, withdrawalFormatted, stake, stakeCurrency, stakeFormatted }) {
    try {
      this.provider.logStakingPoolWithdraw({ network, networkId, sales, salesCurrency, salesFormatted, account, tx, poolKey, poolName, withdrawal, withdrawalCurrency, withdrawalFormatted, stake, stakeCurrency, stakeFormatted })
    } catch (error) {
      console.error('Unhandled Error', error)
    }
  }

  async logStakingPoolWithdrawRewards ({ network, networkId, sales, salesCurrency, salesFormatted, account, tx, poolKey, poolName, reward, rewardCurrency, rewardFormatted, stake, stakeCurrency, stakeFormatted }) {
    try {
      this.provider.logStakingPoolWithdrawRewards(network, networkId, sales, salesCurrency, salesFormatted, account, tx, poolKey, poolName, reward, rewardCurrency, rewardFormatted, stake, stakeCurrency, stakeFormatted)
    } catch (error) {
      console.error('Unhandled Error', error)
    }
  }
}
