import { FAUCET_URL, getSushiswapLink, getUniswapLink } from '@/src/config/constants'
import { useAppConstants } from '@/src/context/AppConstants'
import { useNetwork } from '@/src/context/Network'
import { classNames } from '@/utils/classnames'
import { getNetworkInfo } from '@/utils/network'
import { useMemo } from 'react'

export const NPMSwapLink = ({ tokenAddress, className = '' }) => {
  const { networkId } = useNetwork()
  const { NPMTokenAddress, liquidityTokenAddress } = useAppConstants()

  const npmSwapLink = useMemo(() => {
    if (!NPMTokenAddress || !tokenAddress || !networkId) { return '' }

    if (NPMTokenAddress.toLowerCase() !== tokenAddress.toLowerCase()) { return '' }

    const { isTestNet, isEthereum } = getNetworkInfo(networkId)
    if (isTestNet) { return FAUCET_URL }

    if (isEthereum) { return getUniswapLink(tokenAddress) }

    return getSushiswapLink(liquidityTokenAddress, tokenAddress, networkId)
  }, [NPMTokenAddress, tokenAddress, networkId, liquidityTokenAddress])

  return (
    npmSwapLink && (
      <a
        href={npmSwapLink}
        target='_blank'
        rel='noreferrer'
        className={classNames('ml-2 font-semibold underline text-md text-4E7DD9 h-max w-max', className)}
      >
        Get NPM
      </a>
    )
  )
}
