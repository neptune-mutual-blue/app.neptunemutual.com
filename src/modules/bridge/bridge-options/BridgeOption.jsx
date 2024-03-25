import CheckCircleFilledIcon from '@/icons/CheckCircleFilledIcon'
import { TokenOrCoverLogo } from '@/modules/bridge/bridge-form/TokenOrCoverLogo'
import { InfoKeyValue } from '@/modules/bridge/bridge-options/InfoKeyValue'
import { BRIDGE_KEYS } from '@/src/config/bridge'
import { useLanguageContext } from '@/src/i18n/i18n'
import { classNames } from '@/utils/classnames'
import { formatCurrency } from '@/utils/formatter/currency'

export const BridgeOption = ({
  type,
  time,
  infoArray,
  selected = false,
  onClick,
  priceInUsd
}) => {
  const { locale } = useLanguageContext()

  const name = type === BRIDGE_KEYS.CELER ? 'Celer Bridge' : 'LayerZero Bridge'
  const logo = type === BRIDGE_KEYS.CELER ? '/images/bridge/celer.svg' : '/images/bridge/layer-zero.svg'

  return (
    <button
      className={classNames(
        'rounded-big box-border overflow-hidden border-2 block w-full lg:w-auto',
        selected
          ? 'border-4E7DD9'
          : 'border-transparent'
      )}
      onClick={onClick}
    >
      <div className={classNames(
        'py-2 px-2 lg:p-4 rounded-big border h-full',
        selected ? 'bg-4E7DD9 bg-opacity-10 border-transparent' : 'border-B0C4DB bg-white lg:bg-F3F5F7'
      )}
      >
        <div className='flex items-center gap-2'>
          <TokenOrCoverLogo
            src={logo}
            alt={`${name} bridge logo`}
            wrapperClass='!w-6 !h-6'
            className='w-full h-full'
          />
          <h3 className='text-md lg:text-lg'>{name}</h3>
          {
            selected
              ? (
                <CheckCircleFilledIcon className='w-4 h-4 ml-auto text-4E7DD9' />
                )
              : (
                <div className='w-4 h-4 ml-auto border rounded-full border-9B9B9B bg-EEEEEE' />
                )
          }
        </div>
        <p className='mt-1 text-xs text-left text-21AD8C'>{time}</p>

        <div className='hidden lg:block'>
          <div className='pb-2 mt-6 space-y-2 border-b border-B0C4DB'>
            {
                infoArray.map((item, idx) => {
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
          <div className='flex justify-between mt-3.5'>
            <p className='text-xs'>Total Fee (In USD)</p>
            <p className='font-semibold text-md'>{formatCurrency(priceInUsd, locale).long}</p>
          </div>
        </div>
      </div>
    </button>
  )
}
