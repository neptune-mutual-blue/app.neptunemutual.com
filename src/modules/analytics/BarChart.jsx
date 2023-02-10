import React from 'react'
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function BarChart () {
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug']

  const data = {
    labels,
    datasets: [
      {
        data: labels.map(() => getRandomInt(50, 1000)),
        backgroundColor: '#4E7DD9',
        barPercentage: 0.4,
        borderDash: [10, 9]
      }

    ]
  }

  const options = {
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

        }
      }
    },
    plugins: {
      legend: {
        display: false
      }

    }
  }
  return <Bar options={options} data={data} />
}
