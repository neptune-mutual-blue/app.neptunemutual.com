import { classNames } from '@/utils/classnames'
import { Loader } from '@/common/Loader/Loader'

export const InfoPanel = ({ infoArray, className = '' }) => {
  if (!infoArray || !infoArray.length) { return <></> }

  return (
    <div className={classNames('p-4 rounded-big bg-F3F5F7', className)}>
      {
      infoArray.map((info, idx) => {
        return (
          <div
            key={idx}
            className={
          classNames(
            'flex items-center justify-between text-xs space-y-1',
            info.bold && 'font-semibold text-sm')
        }
          >
            <p>{info.key}</p>
            {
            info.loading ? <Loader className='w-4.5 h-4.5' /> : <p>{info.value}</p>
          }
          </div>
        )
      })
      }
    </div>
  )
}
