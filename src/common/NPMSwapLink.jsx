import { mainnetGetNpmLink, testnetGetNpmLink } from '@/src/config/constants'
import { useNetwork } from '@/src/context/Network'
import { classNames } from '@/utils/classnames'
import { getNetworkInfo } from '@/utils/network'
import { useMemo } from 'react'

export const useNPMSwapLink = (_props) => {
  const { networkId } = useNetwork()

  const npmSwapLink = useMemo(() => {
    if (!networkId) { return '' }

    const { isTestNet } = getNetworkInfo(networkId)
    if (isTestNet) { return testnetGetNpmLink }

    return mainnetGetNpmLink
  }, [networkId])

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
