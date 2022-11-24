import { classNames } from '@/utils/classnames'

const StepsIndicator = ({ completed = '50' }) => {
  return (
    <div className='p-8 mb-8 border bg-FEFEFF border-B0C4DB rounded-2xl'>
      <div className='relative w-full h-4 rounded'>
        <div className='w-full h-4 opacity-30 bg-999BAB' />
        <div className={classNames('absolute top-0 left-0 bg-21AD8C rounded h-4')} style={{ width: `calc(0% + ${completed}%)` }} />
      </div>
      <div className='flex justify-between mt-3'>
        <p>{completed}% Complete</p>
        <p>{completed === '50' ? 'Good Job!' : 'Fabulous!'}</p>
      </div>
    </div>
  )
}

export default StepsIndicator
