import {
  ArcElement,
  Chart as ChartJS
} from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement)

export const PercentDoughnutChart = ({ data }) => {
  return (
    <>
      <div className='w-60 h-60'>
        <Doughnut
          data={data}
          options={{
            cutout: 90,
            events: [
              /* "mousemove", "mouseout", "click", "touchstart", "touchmove", "touchend" */
            ],
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                enabled: false
              }
            }
          }}
          data-testid='percent-doughnut-chart'
        />
      </div>
    </>
  )
}
