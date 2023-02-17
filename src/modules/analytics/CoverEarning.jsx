import { BarChart } from '@/common/BarChart'

function CoverEarning ({ labels, yAxisData, loading }) {
  return (

    <BarChart labels={labels} yAxisData={yAxisData} loading={loading} />
  )
}

export default CoverEarning
