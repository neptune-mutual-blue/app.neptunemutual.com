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

  async logPolicyPurchase ({ network, account, coverKey, productKey, coverFee, coverFeeCurrency, protection, protectionCurrency, coveragePeriod, referralCode, tx }) {
    try {
      this.provider.logPolicyPurchase({ network, account, coverKey, productKey, coverFee, coverFeeCurrency, protection, protectionCurrency, coveragePeriod, referralCode, tx })
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

  async logAddLiquidity ({ network, account, coverKey, stake, stakeCurrency, liquidity, liquidityCurrency, tx }) {
    try {
      this.provider.logAddLiquidity({ network, account, coverKey, stake, stakeCurrency, liquidity, liquidityCurrency, tx })
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

  async logRemoveLiquidity ({ network, account, coverKey, stake, stakeCurrency, liquidity, liquidityCurrency, exit, tx }) {
    try {
      this.provider.logRemoveLiquidity({ network, account, coverKey, stake, stakeCurrency, liquidity, liquidityCurrency, exit, tx })
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

  async logIncidentReported ({ network, account, coverKey, productKey, stake, incidentTitle, incidentDescription, incidentProofs, incidentDate, tx }) {
    try {
      this.provider.logIncidentReported({ network, account, coverKey, productKey, stake, incidentTitle, incidentDescription, incidentProofs, incidentDate, tx })
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

  async logIncidentDisputed ({ network, account, coverKey, productKey, stake, disputeTitle, disputeDescription, disputeProofs, tx }) {
    try {
      this.provider.logIncidentDisputed({ network, account, coverKey, productKey, stake, disputeTitle, disputeDescription, disputeProofs, tx })
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

  async logBondCreated (network, account, lpTokenAmount, receiveAmount, tx) {
    try {
      this.provider.logBondCreated(network, account, lpTokenAmount, receiveAmount, tx)
    } catch (error) {
      console.error('Unhandled Error', error)
    }
  }

  async logBondClaimed (network, account, tx) {
    try {
      this.provider.logBondClaimed(network, account, tx)
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

  async logStakingPoolDepositPopupToggled (network, account, poolKey, opened) {
    try {
      this.provider.logStakingPoolDepositPopupToggled(network, account, poolKey, opened)
    } catch (error) {
      console.error('Unhandled Error', error)
    }
  }

  async logStakingPoolDeposit (network, account, poolKey, stake, stakeCurrency, tx) {
    try {
      this.provider.logStakingPoolDeposit(network, account, poolKey, stake, stakeCurrency, tx)
    } catch (error) {
      console.error('Unhandled Error', error)
    }
  }

  async logStakingPoolCollectPopupToggled (network, account, poolKey, opened) {
    try {
      this.provider.logStakingPoolCollectPopupToggled(network, account, poolKey, opened)
    } catch (error) {
      console.error('Unhandled Error', error)
    }
  }

  async logStakingPoolWithdraw (network, account, poolKey, stake, stakeCurrency, tx) {
    try {
      this.provider.logStakingPoolWithdraw(network, account, poolKey, stake, stakeCurrency, tx)
    } catch (error) {
      console.error('Unhandled Error', error)
    }
  }

  async logStakingPoolWithdrawRewards (network, account, poolKey, tx) {
    try {
      this.provider.logStakingPoolWithdrawRewards(network, account, poolKey, tx)
    } catch (error) {
      console.error('Unhandled Error', error)
    }
  }
}
