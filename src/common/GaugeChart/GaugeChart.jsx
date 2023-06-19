import {
  useEffect,
  useState
} from 'react'

import { linspace } from '@/utils/linspace'

const formatBreakpoint = (breakpoint) => {
  if (breakpoint % 1 === 0) {
    return breakpoint
  } else {
    return breakpoint.toFixed(breakpoint < 1 ? 2 : 1)
  }
}

export const GaugeChart = ({
  chartDiameter = 274,
  strokeWidth = 16,
  min,
  max,
  value
}) => {
  const chartRadius = chartDiameter / 2
  const strokeWidthHalf = strokeWidth / 2

  const [percent, setPercent] = useState(0)

  const percentage = ((value - min) / (max - min))
  const circumference = Math.PI * (chartDiameter - strokeWidth)

  const dashArray = `${circumference * 0.75 * percent}, ${circumference}`
  const dashArrayBG = `${circumference * 0.75}, ${circumference}`

  const breakpointAngles = linspace(45, 315, 11)
  const breakponts = linspace(min, max, 11)

  useEffect(() => {
    setTimeout(() => {
      setPercent(percentage)
    }, 0)
  }, [percentage])

  const breakpointLine = (
    <svg
      width='2'
      height='10'
      viewBox='0 0 2 10'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path d='M1 0V10' stroke='#E5E5E5' strokeWidth='2' />
    </svg>
  )

  return (
    <div className='gauge chart'>
      <div
        className='chart'
        style={{ width: `${chartDiameter}px`, height: `${chartDiameter}px` }}
      >
        <div
          className='bg'
          style={{ width: `${chartDiameter}px`, height: `${chartDiameter}px` }}
        >
          <svg
            width={chartDiameter}
            height={chartDiameter}
            xmlns='http://www.w3.org/2000/svg'
          >
            <circle
              cx={chartRadius}
              cy={chartRadius}
              r={chartRadius - strokeWidthHalf}
              strokeWidth={strokeWidth}
              strokeDasharray={dashArrayBG}
              strokeLinecap='round'
              stroke='#deeaf6'
              fill='none'
            />
          </svg>
        </div>
        <svg
          className='meter'
          height={`${chartRadius - strokeWidth - 8}px`}
          viewBox='0 0 9 113'
          style={{
            transform: `rotateZ(${270 * percent + 47}deg)`
          }}
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M9 3.46411L4.5 112.464L0 3.46411C4.5 -2.5359 7.5 0.464081 9 3.46411Z'
            fill='#4E7DD9'
          />
        </svg>
        <div
          className='foreground'
          style={{ width: `${chartDiameter}px`, height: `${chartDiameter}px` }}
        >
          <svg
            width={chartDiameter}
            height={chartDiameter}
            xmlns='http://www.w3.org/2000/svg'
          >
            <defs>
              <linearGradient id='GradientColor'>
                <stop offset='0%' stopColor='#4E7DD9' />
                <stop offset='100%' stopColor='#E96990' />
              </linearGradient>
            </defs>
            <circle
              stroke='url(#GradientColor)'
              cx={chartRadius}
              cy={chartRadius}
              r={chartRadius - strokeWidthHalf}
              strokeWidth={strokeWidth}
              strokeDasharray={dashArray}
              strokeLinecap='round'
              fill='none'
            />
          </svg>
        </div>

        <div className='breakpoints'>
          {breakponts.map((breakpoint, index) => {
            return (
              <div
                key={breakpoint}
                style={{
                  height: `${chartRadius - strokeWidth - 8}px`,
                  transform: `rotateZ(${breakpointAngles[index]}deg)`
                }}
              >
                <span
                  style={{ transform: `rotateZ(-${breakpointAngles[index]}deg)` }}
                >
                  {formatBreakpoint(breakpoint)}
                </span>
                {breakpointLine}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
