import { useState } from 'react'

import { RegularButton } from '@/common/Button/RegularButton'
import ExternalLinkIcon from '@/icons/ExternalLinkIcon'
import LeftArrow from '@/icons/LeftArrow'
import TrashIcon from '@/icons/TrashIcon'
import WarningCircleIcon from '@/icons/WarningCircleIcon'
import { getTokenLink } from '@/lib/connect-wallet/utils/explorer'
import { TokenAvatar } from '@/modules/swap/add-liquidity/TokenAvatar'
import { useNetwork } from '@/src/context/Network'
import { truncateAddress } from '@/utils/address'

const ImportToken = ({ hide, token, customTokens, setCustomTokens, initiallyManage }) => {
  const [manage, setManage] = useState(initiallyManage)

  const deleteCustomToken = (index) => {
    setCustomTokens(customTokens.filter((_, i) => i !== index))
  }

  const { networkId } = useNetwork()

  const importToken = () => {
    setCustomTokens([...customTokens, token])
    setManage(true)
  }

  return (
    <div className='min-h-647 relative'>
      <div className='flex items-center'>
        <button
          className='flex items-center gap-2.5 text-xs font-semibold leading-6 rounded-2 tracking-2'
          onClick={hide}
        >
          <LeftArrow />
          <span className='text-xs leading-6 font-semibold'>
            BACK
          </span>
        </button>

        {manage && (
          <h3 className='text-display-xs font-semibold ml-[38px]'>Custom Tokens</h3>
        )}
      </div>

      {manage && (
        <div className='mt-4'>
          {customTokens.length === 0 && (

            <div className='text-center'><i>No custom tokens found.</i></div>
          )}
          {customTokens.map((token, index) => (
            <div
              key={token.address}
              className='w-full py-2.5 px-4 rounded-2 mb-4 bg-EEEEEE'
            >
              <div className='flex items-center justify-between gap-1'>

                <TokenAvatar className='w-8 h-8' src={token.logoSrc} verified={token.verified} />

                <div className='mr-auto'>
                  <p className='text-sm font-semibold text-left'>{token.symbol}</p>
                  <p className='text-xs text-left text-404040'>{token.name}</p>
                </div>

                <button onClick={() => deleteCustomToken(index)}>
                  <TrashIcon />
                </button>

              </div>
            </div>
          ))}
        </div>
      )}

      {!manage && (

        <div className='text-center'>
          <WarningCircleIcon className='h-8 w-8 text-E52E2E mx-auto mb-2 mt-4' />

          <div className='text-lg font-semibold mb-1'>Trade at your own risk!</div>
          <div className='max-w-[306px] mx-auto text-sm mb-4'>This token doesn't appear on the active token list(s). Anyone can create a token, including creating fake versions of existing tokens that claim to represent projects.</div>
          <div
            className='w-full py-2.5 px-4 rounded-2 bg-EEEEEE'
          >
            <div className='flex items-center justify-between gap-1'>

              <TokenAvatar className='w-8 h-8' src={token.logoSrc} verified={token.verified} />

              <div className='mr-auto'>
                <p className='text-sm font-semibold text-left'>{token.symbol}</p>
                <p className='text-xs text-left text-404040'>{token.name}</p>
              </div>

              <div>
                <p className='text-sm font-semibold text-right'>{truncateAddress(token.address)}</p>
                <a target='_blank' href={getTokenLink(networkId, token.address)} className='text-xs text-right text-404040 flex items-center gap-1' rel='noreferrer'>
                  <div className='text-xs text-4e7dd9'>View on Explorer</div>
                  <ExternalLinkIcon />
                </a>
              </div>

            </div>
          </div>
        </div>

      )}

      {!manage && (
        <RegularButton onClick={importToken} className='p-4 rounded-tooltip absolute bottom-0 left-0 right-0 text-md font-semibold'>IMPORT</RegularButton>
      )}

    </div>
  )
}

export default ImportToken
