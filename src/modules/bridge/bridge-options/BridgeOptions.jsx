import { useRouter } from 'next/router'

import { RegularButton } from '@/common/Button/RegularButton'
import { Divider } from '@/common/Divider/Divider'
import { BridgeOption } from '@/modules/bridge/bridge-options/BridgeOption'
import { InfoKeyValue } from '@/modules/bridge/bridge-options/InfoKeyValue'
import {
  WalletNotConnected
} from '@/modules/bridge/bridge-options/WalletNotConnected'
import { classNames } from '@/utils/classnames'
import { formatCurrency } from '@/utils/formatter/currency'
import { useWeb3React } from '@web3-react/core'

export const BridgeOptions = ({
  selectedBridge,
  setSelectedBridge,
  buttonText,
  buttonDisabled,
  setBtnClickValue,
  infoData,
  totalPriceInUsd,
  celerDelay
}) => {
  const { active } = useWeb3React()

  return (
    <div className={classNames('lg:w-[764px] p-4 pt-0 lg:p-8 flex flex-col gap-2 lg:gap-6',
      active ? 'justify-between' : 'justify-center'
    )}
    >
      {
        active
          ? (
            <>
              <h2 className='text-xl font-semibold lg:text-display-xs text-999BAB'>
                Bridge Options
              </h2>

              <div className='flex-col justify-between flex-grow hidden lg:flex'>
                <div className='grid gap-4 mb-auto xl:grid-cols-2'>
                  <BridgeOption
                    type='layer-zero'
                    time='10-30 mins'
                    selected={selectedBridge === 'layer-zero'}
                    infoArray={infoData['layer-zero']}
                    priceInUsd={totalPriceInUsd['layer-zero']}
                    onClick={() => setSelectedBridge('layer-zero')}
                  />
                  <BridgeOption
                    type='celer'
                    time={celerDelay}
                    selected={selectedBridge === 'celer'}
                    infoArray={infoData.celer}
                    priceInUsd={totalPriceInUsd.celer}
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
              </div>

              <OptionsMobile
                selectedBridge={selectedBridge}
                setSelectedBridge={setSelectedBridge}
                setBtnClickValue={setBtnClickValue}
                priceInUsd={totalPriceInUsd[selectedBridge || 'celer']}
                infoArray={infoData[selectedBridge || 'celer']}
                celerDelay={celerDelay}
                buttonDisabled={buttonDisabled}
                buttonText={buttonText}
              />
            </>
            )
          : (
            <WalletNotConnected />
            )
      }
    </div>
  )
}

const OptionsMobile = ({
  selectedBridge,
  priceInUsd,
  infoArray,
  setSelectedBridge,
  celerDelay,
  buttonDisabled,
  buttonText,
  setBtnClickValue
}) => {
  const { locale } = useRouter()

  return (
    <div className='block p-4 bg-F3F5F7 rounded-big lg:hidden'>
      <div className='space-y-2'>
        <BridgeOption
          type='layer-zero'
          time='10-30 mins'
          selected={selectedBridge === 'layer-zero'}
          infoArray={infoArray}
          priceInUsd={priceInUsd}
          onClick={() => setSelectedBridge('layer-zero')}
        />
        <BridgeOption
          type='celer'
          time={celerDelay}
          selected={selectedBridge === 'celer'}
          infoArray={infoArray}
          priceInUsd={priceInUsd}
          onClick={() => setSelectedBridge('celer')}
        />
      </div>

      <Divider className='mt-6 mb-4' />

      <div className=''>
        <div className='pb-2 space-y-2 border-b border-B0C4DB'>
          {
            infoArray.map((item, idx) => (
              <InfoKeyValue
                key={idx}
                dataKey={item.key}
                dataValue={item.value}
                bold={item.bold}
                loading={item.loading}
                info={item.info}
                title={item.title}
              />
            ))
          }
        </div>

        <div className='flex justify-between mt-2.5'>
          <p className='text-xs'>Total Fee (In USD)</p>
          <p className='font-semibold text-md'>
            {formatCurrency(priceInUsd, locale).long}
          </p>
        </div>
      </div>

      <RegularButton
        className='w-full p-4 mt-6 font-semibold uppercase text-md rounded-big'
        disabled={!selectedBridge || buttonDisabled}
        onClick={() => setBtnClickValue(prev => prev + 1)}
      >
        {
          !selectedBridge ? 'Select bridge' : buttonText
        }
      </RegularButton>
    </div>
  )
}
