import { useCountdown } from '@/lib/countdown/useCountdown'
import DateLib from '@/lib/date/DateLib'

const getTime = () => {
  return DateLib.unix().toString()
}

const formatCount = (n) => { return String(n).padStart(2, '0') }

export const CountDownTimer = ({ title, target }) => {
  const { hours, minutes, seconds } = useCountdown({
    target,
    getTime
  })

  const time = `${formatCount(hours)}:${formatCount(minutes)}:${formatCount(
    seconds
  )}`

  return (
    <div className='flex flex-col items-center justify-center mt-4 mb-16 text-9B9B9B' data-testid='countdown-timer-component'>
      <span className='text-xs font-semibold uppercase'>{title}</span>
      <span className='text-display-xs'>{time}</span>
    </div>
  )
}
