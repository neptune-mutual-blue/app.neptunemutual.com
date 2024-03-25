import { BarChart } from '@/common/BarChart'
import { useLanguageContext } from '@/src/i18n/i18n'
import { formatCurrency } from '@/utils/formatter/currency'

function CoverEarning ({ labels, yAxisData, loading }) {
  const { locale } = useLanguageContext()

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
