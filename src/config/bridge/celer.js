const CELER_URL = {
  TESTNET: 'https://cbridge-v2-test.celer.network',
  MAINNET: 'https://cbridge-prod2.celer.app'
}

export const getConfigUrl = (isTestNet) => {
  return isTestNet
    ? `${CELER_URL.TESTNET}/v2/getTransferConfigs`
    : `${CELER_URL.MAINNET}/v2/getTransferConfigs`
}

export const getAmountEstimationUrl = ({
  isTestNet = false,
  srcChainId,
  destChainId,
  tokenSymbol,
  sendAmountInUnits,
  receiverAddress,
  slippage
}) => {
  const base = isTestNet ? CELER_URL.TESTNET : CELER_URL.MAINNET

  return `${base}/v2/estimateAmt?src_chain_id=${srcChainId}&dst_chain_id=${destChainId}&token_symbol=${tokenSymbol}&amt=${sendAmountInUnits}&usr_addr=${receiverAddress}&slippage_tolerance=${slippage}`
}

export const GAS_LIMIT_WITHOUT_APPROVAL = 350_000

export const GAS_LIMIT_WITH_APPROVAL = 300_000
