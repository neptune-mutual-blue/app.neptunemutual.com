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

export const GaugeChartSemiCircle = ({
  chartDiameter = 278,
  strokeWidth = 24,
  min,
  max,
  value
}) => {
  const chartRadius = chartDiameter / 2
  const strokeWidthHalf = strokeWidth / 2

  const [percent, setPercent] = useState(0)

  const percentage = ((value - min) / (max - min))
  const circumference = Math.PI * (chartDiameter - strokeWidth)

  const dashArray = `${circumference * 0.5 * percent}, ${circumference}`
  const dashArrayBG = `${circumference * 0.5}, ${circumference}`

  const breakpointAngles = linspace(90, 270, 11)
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
      <path d='M1 0V10' stroke='#A3A3A3' strokeWidth='2' />
    </svg>
  )

  return (
    <div className='pointer-events-none gauge semichart'>
      <div
        className='chart'
        style={{ width: `${chartDiameter}px`, height: `${chartRadius}px`, margin: '0 auto' }}
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
              stroke='#deeaf6'
              fill='none'
            />
          </svg>
        </div>
        {/* <div
          className='meter label'
          style={{
            transform: `rotateZ(${percent * 180 - 90}deg)`,
            height: `${chartRadius + 2 * strokeWidth}px`
          }}
        >
          <div
            style={{
              transform: `rotateZ(${(percent * 180 - 90) * -1}deg)`
            }}
          >
            Average
          </div>
        </div> */}
        <svg
          className='meter'
          height={`${chartRadius - strokeWidth}px`}
          style={{
            transform: `rotateZ(${percent * 180 - 90}deg)`,
            overflow: 'visible'
          }}
          width='17' viewBox={`0 0 17 ${chartRadius - strokeWidth}`} fill='none' xmlns='http://www.w3.org/2000/svg'
        >
          <path d='M0.189399 112.464L8.52166 0.138551L16.1843 112.867C13.408 123.801 1.96204 121.512 0.189399 112.464Z' fill='#01052D' />
        </svg>

        <div
          className='foreground'
          style={{ width: `${chartDiameter}px`, height: `${chartDiameter}px` }}
        >
          <svg
            width={chartDiameter}
            height={chartDiameter}
            style={{ overflow: 'visible' }}
            xmlns='http://www.w3.org/2000/svg'
          >
            <defs>
              <linearGradient id='GradientColor'>
                <stop offset='0%' stopColor='#4CA30D' />
                <stop offset='26.04%' stopColor='#1570EF' />
                <stop offset='59.17%' stopColor='#BA24D5' />
                <stop offset='83.09%' stopColor='#E31B54' />
                <stop offset='100%' stopColor='#EAAA08' />
              </linearGradient>
              <filter id='filter0_f_12947_142116' filterUnits='userSpaceOnUse' height='200%' width='200%' colorInterpolationFilters='sRGB'>
                <feFlood floodOpacity='0' result='BackgroundImageFix' />
                <feBlend mode='normal' in='SourceGraphic' in2='BackgroundImageFix' result='shape' />
                <feGaussianBlur stdDeviation='16' result='effect1_foregroundBlur_12947_142116' />
              </filter>
            </defs>
            <circle
              stroke='url(#GradientColor)'
              cx={chartRadius}
              cy={chartRadius}
              r={chartRadius - strokeWidthHalf}
              strokeWidth={strokeWidth}
              strokeDasharray={dashArray}
              fill='none'
            />
            <circle
              filter='url(#filter0_f_12947_142116)'
              stroke='url(#GradientColor)'
              cx={chartRadius}
              cy={chartRadius}
              r={chartRadius - strokeWidthHalf}
              strokeWidth={strokeWidth}
              strokeDasharray={dashArray}
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
                {[0, 5, 10].includes(index) && (
                  <span
                    style={{ transform: `rotateZ(-${breakpointAngles[index]}deg)` }}
                  >
                    {formatBreakpoint(breakpoint)}
                  </span>
                )}
                {breakpointLine}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
