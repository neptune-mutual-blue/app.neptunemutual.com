import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip
} from 'chart.js'
import { useRouter } from 'next/router'
import { Bar } from 'react-chartjs-2'

import { formatCurrency } from '@/utils/formatter/currency'
import { Trans } from '@lingui/macro'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

export function BarChart ({ labels, yAxisData, loading, formatTooltipLabel = undefined }) {
  const router = useRouter()

  const barData = {
    labels,
    datasets: [
      {
        data: yAxisData,
        backgroundColor: '#4E7DD9',
        barPercentage: 0.4,
        borderDash: [10, 9]
      }

    ]
  }

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        grid: {
          drawBorder: false,
          borderDash: [2, 3]

        },
        ticks: {
          callback: function (val) {
            return val === 0 ? 0 : formatCurrency(this.getLabelForValue(val).replace(/,/g, ''), router.locale, '', true, true).short
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            if (formatTooltipLabel) { return formatTooltipLabel(context.raw) }
          }

        }
      }
    }
  }

  if (loading) {
    return <div className='grid items-center justify-center h-391 lg:h-fill'><Trans>loading...</Trans></div>
  }

  return <Bar className='h-391 lg:h-auto' options={options} data={barData} />
}
