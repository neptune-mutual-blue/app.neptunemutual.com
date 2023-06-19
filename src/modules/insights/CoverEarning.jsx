import { BarChart } from '@/common/BarChart'
import { formatCurrency } from '@/utils/formatter/currency'
import { useRouter } from 'next/router'

function CoverEarning ({ labels, yAxisData, loading }) {
  const { locale } = useRouter()

  return (

    <BarChart
      labels={labels}
      yAxisData={yAxisData}
      loading={loading}
      formatTooltipLabel={val => { return formatCurrency(val, locale).long }}
    />
  )
}

export default CoverEarning
