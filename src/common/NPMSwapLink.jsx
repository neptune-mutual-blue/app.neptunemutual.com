import { FAUCET_URL, getSushiswapLink, getUniswapLink } from '@/src/config/constants'
import { useAppConstants } from '@/src/context/AppConstants'
import { useNetwork } from '@/src/context/Network'
import { classNames } from '@/utils/classnames'
import { getNetworkInfo } from '@/utils/network'
import { useMemo } from 'react'

export const useNPMSwapLink = (props) => {
  const { networkId } = useNetwork()
  const { NPMTokenAddress, liquidityTokenAddress } = useAppConstants()

  const npmSwapLink = useMemo(() => {
    if (!NPMTokenAddress || !networkId) { return '' }

    if (props?.tokenAddress && NPMTokenAddress.toLowerCase() !== props?.tokenAddress.toLowerCase()) { return '' }

    const { isTestNet, isEthereum } = getNetworkInfo(networkId)
    if (isTestNet) { return FAUCET_URL }

    if (isEthereum) { return getUniswapLink(NPMTokenAddress) }

    return getSushiswapLink(liquidityTokenAddress, NPMTokenAddress, networkId)
  }, [NPMTokenAddress, props?.tokenAddress, networkId, liquidityTokenAddress])

  return npmSwapLink
}

export const NPMSwapLink = ({ tokenAddress, className = '' }) => {
  const npmSwapLink = useNPMSwapLink({ tokenAddress })

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
