import {
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'

import { useRouter } from 'next/router'

import DownArrow from '@/icons/DownArrow'
import { AddressInput } from '@/modules/bridge/bridge-form/AddressInput'
import { NetworkSelect } from '@/modules/bridge/bridge-form/NetworkSelect'
import { TransferAmountInput } from '@/modules/bridge/bridge-form/TransferAmountInput'
import { networks } from '@/src/config/networks'
import { useNetwork } from '@/src/context/Network'
import { useCelerBridge } from '@/src/hooks/useCelerBridge'
import { useDebounce } from '@/src/hooks/useDebounce'
import { getNetworkInfo } from '@/utils/network'
import {
  convertFromUnits,
  convertToUnits,
  toBNSafe
} from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'
import { isAddress } from '@ethersproject/address'
import { useWeb3React } from '@web3-react/core'
import { BalanceError } from '@/modules/bridge/bridge-form/DestinationBalanceError'
import * as celerConfig from '@/src/config/bridge/celer'
import { CELER_BRIDGE_PROTOCOL_FEE_RATE } from '@/src/config/constants'
import { chains } from '@/lib/connect-wallet/config/chains'
import { getSumInDollars } from '@/modules/bridge/bridge-form/getSumInDollars'

const SLIPPAGE_MULTIPLIER = 1_000_000
const SLIPPAGE = (0.3 / 100) * SLIPPAGE_MULTIPLIER // 0.3%

export const CelerBridgeModule = ({
  setButtonText,
  setButtonDisabled,
  btnClickValue,
  setInfoArray,
  selectedBridge,
  sendAmount,
  setSendAmount,
  receiverAddress,
  setReceiverAddress,
  selectedNetworks,
  setSelectedNetworks,
  conversionRates,
  setTotalPriceInUsd,
  setDelayPeriod
}) => {
  const { locale } = useRouter()
  const { networkId } = useNetwork()
  const { account } = useWeb3React()
  const { isTestNet } = getNetworkInfo(networkId)

  const tokenData = isTestNet ? celerConfig.TESTNET_USDT_BRIDGE_TOKENS : celerConfig.MAINNET_NPM_BRIDGE_TOKENS
  const tokenSymbol = isTestNet ? 'USDT' : 'NPM'

  const filteredNetworks = useMemo(() => {
    const _networks = isTestNet ? networks.testnet : networks.mainnet
    const filtered = _networks
      .filter(n => Object.keys(tokenData).includes(n.chainId.toString())) // filtered based on availability of tokens

    return filtered
  }, [isTestNet, tokenData])

  const bridgeContractAddress = celerConfig.BRIDGE_CONTRACTS[networkId]

  const [estimation, setEstimation] = useState(null)
  const [balanceError, setBalanceError] = useState('')

  const sourceTokenAddress = tokenData[networkId].address
  const sourceTokenDecimals = tokenData[networkId].decimal

  const destinationTokenData = selectedNetworks?.network2?.chainId ? tokenData[selectedNetworks?.network2?.chainId] : {}
  // const destinationTokenAddress = destinationTokenData.address || ''
  const destinationTokenDecimals = destinationTokenData?.decimal || 1

  const {
    balance,
    allowance,
    handleApprove,
    handleBridge,
    approving,
    bridging,
    getEstimatedReceiveAmount,
    estimating: calculatingFee,
    getEstimatedCurrentChainGas,
    delayPeriod,
    chainGasPrice
  } = useCelerBridge({
    bridgeContractAddress,
    tokenAddress: sourceTokenAddress,
    tokenSymbol,
    tokenDecimal: sourceTokenDecimals
  })

  useEffect(() => {
    const options = networks[getNetworkInfo(networkId).isMainNet ? 'mainnet' : 'testnet']
    setSelectedNetworks((prev) => ({ ...prev, network1: options.find(x => x.chainId === parseInt(networkId)) }))

    // eslint-disable-next-line
  }, [networkId])

  const debouncedAmount = useDebounce(convertToUnits(sendAmount || '0', sourceTokenDecimals).toString(), 1000)
  const srcChainId = selectedNetworks?.network1?.chainId
  const destChainId = selectedNetworks?.network2?.chainId
  const _receiverAddress = receiverAddress || account

  const srcChainConfig = chains.find(x => x.chainId === `0x${(networkId).toString(16)}`)

  const updateEstimation = useCallback(async function () {
    setBalanceError('')
    const _estimation = await getEstimatedReceiveAmount(
      debouncedAmount,
      _receiverAddress,
      srcChainId,
      destChainId,
      SLIPPAGE
    )
    if (_estimation?.err) setBalanceError(_estimation.err.msg)
    else setEstimation(_estimation)

    const fees = await getEstimatedCurrentChainGas(
      convertToUnits(sendAmount, sourceTokenDecimals).toString()
    )
    if (fees) setEstimation(_prev => ({ ..._prev, currentChainGas: fees }))

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_receiverAddress, debouncedAmount, destChainId, srcChainId])

  useEffect(() => {
    updateEstimation()
  }, [updateEstimation])

  const canApprove =
    !toBNSafe(sendAmount).isZero() &&
    convertToUnits(sendAmount, sourceTokenDecimals).isLessThanOrEqualTo(balance) &&
    convertToUnits(sendAmount, sourceTokenDecimals).isGreaterThan(allowance)

  const canBridge =
    !toBNSafe(sendAmount).isZero() &&
    convertToUnits(sendAmount, sourceTokenDecimals).isLessThanOrEqualTo(allowance)

  const isValidAddress = isAddress(receiverAddress || account)

  const handleBridgeClick = async () => {
    if (canBridge) {
      await updateEstimation()

      await handleBridge(
        convertToUnits(sendAmount, sourceTokenDecimals).toString(),
        selectedNetworks.network2,
        receiverAddress || account,
        estimation.max_slippage
      )
      return
    }

    if (canApprove) {
      handleApprove(
        convertToUnits(sendAmount, sourceTokenDecimals).toString()
      )
    }
  }

  const buttonDisabled =
    !(canApprove || canBridge) ||
    approving ||
    bridging ||
    calculatingFee ||
    (canBridge && receiverAddress && !isValidAddress)

  useEffect(() => {
    if (selectedBridge !== 'celer') return

    setButtonText(canBridge ? 'Bridge' : `Approve ${tokenSymbol}`)
    setButtonDisabled(buttonDisabled)
  // eslint-disable-next-line
  }, [canBridge, tokenSymbol, buttonDisabled, selectedBridge])

  useEffect(() => {
    if (selectedBridge !== 'celer') return

    if (btnClickValue) handleBridgeClick()
    // eslint-disable-next-line
  }, [btnClickValue, selectedBridge])

  useEffect(() => {
    setDelayPeriod(delayPeriod)
    // eslint-disable-next-line
  }, [delayPeriod])

  useEffect(() => {
    const formattedReceiveAmount = formatCurrency(
      convertFromUnits(
        estimation?.estimated_receive_amt || '0', destinationTokenDecimals)
      , locale, tokenSymbol, true)

    const formattedProtocolFee = formatCurrency(
      toBNSafe(CELER_BRIDGE_PROTOCOL_FEE_RATE)
        .dividedBy(100)
        .multipliedBy(sendAmount || '0')
        .toString(),
      locale, tokenSymbol, true
    )
    const formattedCurrentChainGas = formatCurrency(
      convertFromUnits(estimation?.currentChainGas || '0', srcChainConfig.nativeCurrency.decimals),
      locale,
      srcChainConfig.nativeCurrency.symbol,
      true
    )

    const formattedBaseFee = formatCurrency(
      convertFromUnits(
        estimation?.base_fee || '0', destinationTokenDecimals)
      , locale, tokenSymbol, true)

    const totalPrice = getSumInDollars({
      rates: conversionRates,
      amounts: [
        {
          token: srcChainConfig.nativeCurrency.symbol,
          value: convertFromUnits(estimation?.currentChainGas || '0', srcChainConfig.nativeCurrency.decimals).toString(),
          decimals: srcChainConfig.nativeCurrency.decimals
        },
        {
          token: tokenSymbol,
          value: convertFromUnits(estimation?.base_fee || '0', destinationTokenDecimals).toString(),
          decimals: destinationTokenDecimals
        },
        {
          token: tokenSymbol,
          value: toBNSafe(CELER_BRIDGE_PROTOCOL_FEE_RATE)
            .dividedBy(100)
            .multipliedBy(sendAmount || '0')
            .toString(),
          decimals: destinationTokenDecimals
        }
      ]
    })
    setTotalPriceInUsd(totalPrice)

    const formattedChainGasPriceInGwei = formatCurrency(
      convertFromUnits(chainGasPrice, 9),
      locale,
      'Gwei',
      true
    )

    setInfoArray([
      { key: 'Receive (estimated)', value: formattedReceiveAmount.short, bold: true, loading: calculatingFee },
      {
        key: `Current Chain Gas Fee (${formattedChainGasPriceInGwei.short})`,
        value: formattedCurrentChainGas.short,
        loading: calculatingFee,
        info: 'Estimated Gas fee for current chain'
      },
      {
        key: 'Base Fee',
        value: formattedBaseFee.short,
        loading: calculatingFee,
        info: 'Estimated base fee'
      },
      {
        key: 'Protocol Fee (0.05%)',
        value: formattedProtocolFee.short,
        info: 'Protocol Fee amount'
      }
    ])
    // eslint-disable-next-line
  }, [calculatingFee, chainGasPrice, destinationTokenDecimals, estimation, locale, srcChainConfig, tokenSymbol, conversionRates, sendAmount])

  if (selectedBridge && selectedBridge !== 'celer') return <></>

  return (
    <div className='flex-grow p-4 lg:p-8 lg:max-w-450'>
      <h1 className='text-xl font-semibold lg:text-display-xs'>Celer Bridge</h1>

      <div className='relative mt-4'>
        <TransferAmountInput
          balance={balance}
          tokenDecimals={sourceTokenDecimals}
          tokenSymbol={tokenSymbol}
          value={sendAmount}
          onChange={(val) => setSendAmount(val)}
        />

        <AddressInput
          value={receiverAddress}
          onChange={setReceiverAddress}
          className='mt-2.5'
          placeholder="Enter Receiver's Wallet Address"
        />

        <div className='relative mt-4'>

          <NetworkSelect
            label='From'
            selected={selectedNetworks.network1}
            defaultChain={parseInt(networkId)}
            onChange={() => {}}
            disabled
          />

          <i className='absolute flex items-center justify-center w-8 h-8 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full top-1/2 left-1/2'>
            <DownArrow className='w-5 h-5 text-4E7DD9' />
          </i>

          <NetworkSelect
            label='To'
            className='mt-2.5'
            selected={selectedNetworks.network2}
            options={filteredNetworks.filter(n => n.chainId.toString() !== networkId.toString())}
            onChange={(val) =>
              setSelectedNetworks((prev) => ({ ...prev, network2: val }))}
          />
        </div>

        <BalanceError className='mt-4' message={balanceError} />
      </div>
    </div>
  )
}
