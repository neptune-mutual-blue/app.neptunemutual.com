import { InfoTooltip } from '@/common/Cover/InfoTooltip'
import { Loader } from '@/common/Loader/Loader'
import InfoCircleIcon from '@/icons/InfoCircleIcon'
import { classNames } from '@/utils/classnames'

const InfoKeyValue = ({ dataKey, dataValue, loading = false, bold = false, info = '' }) => (
  <div
    className={classNames(
      'flex justify-between',
      bold ? 'text-sm font-semibold' : 'text-xs'
    )}
  >
    <div className='flex items-center gap-1'>
      <p>{dataKey}</p>
      {
        info && (
          <InfoTooltip infoComponent={info} className='px-2 py-1'>
            <button>
              <InfoCircleIcon />
            </button>
          </InfoTooltip>
        )
      }
    </div>
    {
      loading ? <Loader className='w-4.5 h-4.5' /> : <p>{dataValue}</p>
    }
  </div>
)

export { InfoKeyValue }
