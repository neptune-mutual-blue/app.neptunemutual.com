import { useRouter } from 'next/router'

import { RegularButton } from '@/common/Button/RegularButton'
import { Divider } from '@/common/Divider/Divider'
import { BridgeOption } from '@/modules/bridge/bridge-options/BridgeOption'
import { InfoKeyValue } from '@/modules/bridge/bridge-options/InfoKeyValue'
import {
  WalletNotConnected
} from '@/modules/bridge/bridge-options/WalletNotConnected'
import { BRIDGE_KEYS } from '@/src/config/bridge'
import { classNames } from '@/utils/classnames'
import { formatCurrency } from '@/utils/formatter/currency'
import { useWeb3React } from '@web3-react/core'

export const BridgeOptions = ({
  selectedBridge,
  setSelectedBridge,
  infoData,
  totalPriceInUsd,
  celerDelay,
  children,

  isCelerBridgeEnabled,
  isLayerZeroBridgeEnabled,
  isCelerBridgeAvailable
}) => {
  const { active } = useWeb3React()

  return (
    <div className={classNames(
      'lg:w-[764px] p-4 pt-0 lg:p-8 flex flex-col gap-2 lg:gap-6',
      active ? 'justify-between' : 'justify-center'
    )}
    >
      {!active && <WalletNotConnected />}
      {
        active &&
          (
            <>
              <h2 className='text-xl font-semibold lg:text-display-xs text-999BAB'>
                Bridge Options
              </h2>

              <div className='flex-col justify-between flex-grow hidden lg:flex'>
                <div className='grid gap-4 mb-auto xl:grid-cols-2'>
                  {isLayerZeroBridgeEnabled && (
                    <BridgeOption
                      type={BRIDGE_KEYS.LAYERZERO}
                      time='10-30 mins'
                      priceInUsd={totalPriceInUsd[BRIDGE_KEYS.LAYERZERO]}
                      infoArray={infoData[BRIDGE_KEYS.LAYERZERO]}
                      selected={selectedBridge === BRIDGE_KEYS.LAYERZERO}
                      onClick={() => { return setSelectedBridge(BRIDGE_KEYS.LAYERZERO) }}
                    />)}
                  {isCelerBridgeEnabled && isCelerBridgeAvailable && (
                    <BridgeOption
                      type={BRIDGE_KEYS.CELER}
                      time={celerDelay}
                      priceInUsd={totalPriceInUsd[BRIDGE_KEYS.CELER]}
                      infoArray={infoData[BRIDGE_KEYS.CELER]}
                      selected={selectedBridge === BRIDGE_KEYS.CELER}
                      onClick={() => { return setSelectedBridge(BRIDGE_KEYS.CELER) }}
                    />)}
                </div>

                <div className='flex justify-end'>
                  {selectedBridge
                    ? children
                    : (
                      <RegularButton
                        className='p-4 mt-6 font-semibold uppercase text-md rounded-big'
                        disabled
                      >
                        Select bridge
                      </RegularButton>
                      )}
                </div>
              </div>

              <OptionsMobile
                selectedBridge={selectedBridge}
                setSelectedBridge={setSelectedBridge}
                totalPriceInUsd={totalPriceInUsd}
                infoData={infoData}
                celerDelay={celerDelay}
                isCelerBridgeEnabled={isCelerBridgeEnabled}
                isLayerZeroBridgeEnabled={isLayerZeroBridgeEnabled}
                isCelerBridgeAvailable={isCelerBridgeAvailable}
              >
                {children}
              </OptionsMobile>
            </>
          )

      }
    </div>
  )
}

const OptionsMobile = ({
  selectedBridge,
  totalPriceInUsd,
  infoData,
  setSelectedBridge,
  celerDelay,
  children,
  isCelerBridgeEnabled,
  isLayerZeroBridgeEnabled,
  isCelerBridgeAvailable
}) => {
  const { locale } = useRouter()

  return (
    <div className='block p-4 bg-F3F5F7 rounded-big lg:hidden'>
      <div className='space-y-2'>
        {isLayerZeroBridgeEnabled && (
          <BridgeOption
            type={BRIDGE_KEYS.LAYERZERO}
            time='10-30 mins'
            priceInUsd={totalPriceInUsd[BRIDGE_KEYS.LAYERZERO]}
            infoArray={infoData[BRIDGE_KEYS.LAYERZERO]}
            selected={selectedBridge === BRIDGE_KEYS.LAYERZERO}
            onClick={() => { return setSelectedBridge(BRIDGE_KEYS.LAYERZERO) }}
          />)}
        {isCelerBridgeEnabled && isCelerBridgeAvailable && (
          <BridgeOption
            type={BRIDGE_KEYS.CELER}
            time={celerDelay}
            priceInUsd={totalPriceInUsd[BRIDGE_KEYS.CELER]}
            infoArray={infoData[BRIDGE_KEYS.CELER]}
            selected={selectedBridge === BRIDGE_KEYS.CELER}
            onClick={() => { return setSelectedBridge(BRIDGE_KEYS.CELER) }}
          />)}
      </div>

      <Divider className='mt-6 mb-4' />

      <div className=''>
        <div className='pb-2 space-y-2 border-b border-B0C4DB'>
          {
            infoData[selectedBridge || BRIDGE_KEYS.CELER].map((item, idx) => {
              return (
                <InfoKeyValue
                  key={idx}
                  dataKey={item.key}
                  dataValue={item.value}
                  bold={item.bold}
                  loading={item.loading}
                  info={item.info}
                  title={item.title}
                />
              )
            })
          }
        </div>

        <div className='flex justify-between mt-2.5'>
          <p className='text-xs'>Total Fee (In USD)</p>
          <p className='font-semibold text-md'>
            {formatCurrency(totalPriceInUsd[selectedBridge || BRIDGE_KEYS.CELER], locale).long}
          </p>
        </div>
      </div>

      {selectedBridge
        ? children
        : (
          <RegularButton
            className='w-full p-4 mt-6 font-semibold uppercase text-md rounded-big'
            disabled
          >
            Select bridge
          </RegularButton>
          )}
    </div>
  )
}
