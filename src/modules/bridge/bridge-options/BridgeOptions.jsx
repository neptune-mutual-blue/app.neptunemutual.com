import { RegularButton } from '@/common/Button/RegularButton'
import { BridgeOption } from '@/modules/bridge/bridge-options/BridgeOption'
import { WalletNotConnected } from '@/modules/bridge/bridge-options/WalletNotConnected'
import { classNames } from '@/utils/classnames'
import { useWeb3React } from '@web3-react/core'

const BridgeOptions = ({
  selectedBridge,
  setSelectedBridge,
  buttonText,
  buttonDisabled,
  setBtnClickValue,
  infoData
}) => {
  const { active } = useWeb3React()

  return (
    <div className={classNames('w-[764px] p-8 flex flex-col gap-6',
      active ? 'justify-between' : 'justify-center'
    )}
    >
      {
        active
          ? (
            <>
              <h2 className='font-semibold text-display-xs text-999BAB'>
                Bridge Options
              </h2>

              <div className='grid grid-cols-2 gap-4 mb-auto'>
                <BridgeOption
                  type='layer-zero'
                  time='10-30 mins'
                  selected={selectedBridge === 'layer-zero'}
                  infoArray={infoData['layer-zero']}
                  onClick={() => setSelectedBridge('layer-zero')}
                />
                <BridgeOption
                  type='celer'
                  time='9 mins'
                  selected={selectedBridge === 'celer'}
                  infoArray={infoData.celer}
                  onClick={() => setSelectedBridge('celer')}
                />
              </div>

              <div className='flex justify-end'>
                <RegularButton
                  className='p-4 mt-6 font-semibold uppercase text-md rounded-big'
                  disabled={!selectedBridge || buttonDisabled}
                  onClick={() => setBtnClickValue(prev => prev + 1)}
                >
                  {
                    !selectedBridge ? 'Select bridge' : buttonText
                  }
                </RegularButton>
              </div>
            </>
            )
          : (
            <WalletNotConnected />
            )
      }
    </div>
  )
}

export { BridgeOptions }
