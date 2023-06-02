import { useRouter } from 'next/router'

import { Alert } from '@/common/Alert/Alert'
import { RegularButton } from '@/common/Button/RegularButton'
import { ShortNetworkNames } from '@/lib/connect-wallet/config/chains'
import GovernanceCard from '@/modules/governance/GovernanceCard'
import { requiredBalance } from '@/src/config/constants'
import { networks } from '@/src/config/networks'
import { useAppConstants } from '@/src/context/AppConstants'
import { useNetwork } from '@/src/context/Network'
import { useERC20Balance } from '@/src/hooks/useERC20Balance'
import {
  convertFromUnits,
  convertToUnits
} from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'
import { getNetworkInfo } from '@/utils/network'
import { Trans } from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'

const AccountDetail = ({ title, selectedChains }) => {
  const { account } = useWeb3React()
  const { NPMTokenAddress, NPMTokenSymbol, NPMTokenDecimals } = useAppConstants()
  const { balance } = useERC20Balance(NPMTokenAddress)
  const { networkId } = useNetwork()
  const router = useRouter()

  const { isMainNet } = getNetworkInfo(networkId)

  const currentNetwork = networkId && networks[isMainNet ? 'mainnet' : 'testnet'].find(n => n.chainId === networkId)

  const isBalanceInsufficient = convertToUnits(requiredBalance, NPMTokenDecimals).isGreaterThan(balance)

  const chainName = selectedChains.map(chainId => ShortNetworkNames[chainId])

  return (
    <GovernanceCard className='p-4 md:p-8'>
      <div className='p-6 bg-F3F5F7 rounded-2'>
        <div className='flex flex-col gap-4'>
          <div className='flex flex-col gap-1'>
            <h4 className='text-sm font-semibold text-999BAB'><Trans>Account</Trans></h4>
            <p className='break-words'>
              {account || 'N/A'}
            </p>
          </div>

          <div className='flex flex-col gap-4 sm:gap-8 sm:flex-row'>
            <div className='flex flex-col gap-1'>
              <h4 className='text-sm font-semibold text-999BAB'>
                <Trans>Current Network</Trans>
              </h4>
              <p className='text-xl'>{currentNetwork?.name}</p>
            </div>
            <div className='flex flex-col gap-1'>
              <h4 className='text-sm font-semibold text-999BAB'>
                <Trans>Balance</Trans>
              </h4>
              <p className={`text-xl ${isBalanceInsufficient ? 'text-E52E2E' : 'text-01052D'}`}>{formatCurrency(
                convertFromUnits(balance, NPMTokenDecimals),
                router.locale,
                NPMTokenSymbol,
                true
              ).long}
              </p>
            </div>
            <div className='flex flex-col gap-1'>
              <h4 className='text-sm font-semibold text-999BAB'>
                <Trans>Required</Trans>
              </h4>
              <p className='text-xl'>{formatCurrency(
                requiredBalance,
                router.locale,
                NPMTokenSymbol,
                true
              ).long}
              </p>
            </div>
          </div>
        </div>
      </div>

      {selectedChains.length === 1 &&
        <RegularButton className='mt-6 rounded-tooltip py-[11px] px-4 font-semibold uppercase z-auto relative hover:bg-opacity-90'>
          <Trans>Set Gauge On {chainName}</Trans>
        </RegularButton>}

      {isBalanceInsufficient &&
      (
        <Alert className='!mt-6'>
          <ul className='list-disc pl-7'>
            {/* <li>Incorrect Network: {currentNetwork?.name}</li> */}
            <li>Your balance is not sufficient to set {title}</li>
          </ul>
        </Alert>
      )}
    </GovernanceCard>
  )
}

export default AccountDetail
