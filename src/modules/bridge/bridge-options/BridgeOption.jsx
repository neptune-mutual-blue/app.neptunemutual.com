import { CoverAvatar } from '@/common/CoverAvatar'
import { Loader } from '@/common/Loader/Loader'
import CheckCircleFilledIcon from '@/icons/CheckCircleFilledIcon'
import { classNames } from '@/utils/classnames'

const BridgeOption = ({
  type,
  time,
  infoArray,
  selected = false,
  onClick
}) => {
  const name = type === 'celer' ? 'Celer Bridge' : 'LayerZero Bridge'
  const logo = type === 'celer' ? '/images/bridge/celer.svg' : '/images/bridge/layer-zero.svg'

  return (
    <button
      className={classNames(
        'rounded-big box-border overflow-hidden border-2 block',
        selected
          ? 'border-4E7DD9'
          : 'border-transparent'
      )}
      onClick={onClick}
    >
      <div className={classNames(
        'p-4 rounded-big border',
        selected ? 'bg-4E7DD9 bg-opacity-10 border-transparent' : 'border-B0C4DB bg-F3F5F7'
      )}
      >
        <div className='flex items-center gap-2'>
          <CoverAvatar size='xs' containerClass='flex-grow-1' imgs={[{ src: logo }]} />
          <h3 className='text-lg'>{name}</h3>
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
        <div className='pb-2 mt-6 space-y-2 border-b border-B0C4DB'>
          {
              infoArray.map((info, idx) => (
                <div
                  className={classNames(
                    'flex justify-between',
                    info.bold ? 'text-sm font-semibold' : 'text-xs'
                  )}
                  key={idx}
                >
                  <p>{info.key}</p>
                  {
                info.loading ? <Loader className='w-4.5 h-4.5' /> : <p>{info.value}</p>
              }
                </div>
              ))
            }
        </div>
        <div className='flex justify-between mt-3.5'>
          <p className='text-xs'>Total Fee (In USD)</p>
          <p className='font-semibold text-md'>N/A</p>
        </div>
      </div>
    </button>
  )
}

export { BridgeOption }
