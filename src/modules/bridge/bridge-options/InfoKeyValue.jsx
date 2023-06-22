import { InfoTooltip } from '@/common/Cover/InfoTooltip'
import { Loader } from '@/common/Loader/Loader'
import InfoCircleIcon from '@/icons/InfoCircleIcon'
import { classNames } from '@/utils/classnames'

export const InfoKeyValue = ({ dataKey, dataValue, loading = false, bold = false, info = '', title = undefined }) => {
  return (
    <div
      className={classNames(
        'flex justify-between gap-2',
        bold ? 'text-sm font-semibold' : 'text-xs'
      )}
    >
      <div className='flex items-center min-w-0 gap-1'>
        <p className='overflow-hidden whitespace-nowrap text-ellipsis'>{dataKey}</p>
        {
        info && (
          <InfoTooltip infoComponent={info} className='px-2 py-1'>
            <span>
              <InfoCircleIcon />
            </span>
          </InfoTooltip>
        )
      }
      </div>
      {
      loading ? <Loader className='w-4.5 h-4.5' /> : <p title={title} className='whitespace-nowrap'>{dataValue}</p>
    }
    </div>
  )
}
