import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { formatCurrency } from '@/utils/formatter/currency'
import { useRouter } from 'next/router'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

export function BarChart ({ labels, yAxisData }) {
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
      }

    }
  }

  return <Bar className='h-500' options={options} data={barData} />
}
