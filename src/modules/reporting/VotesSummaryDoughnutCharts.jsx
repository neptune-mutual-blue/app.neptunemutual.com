import { PercentDoughnutChart } from '@/common/PercentDoughnutChart'
import { useAppConstants } from '@/src/context/AppConstants'
import { useLanguageContext } from '@/src/i18n/i18n'
import { classNames } from '@/utils/classnames'
import { formatPercent } from '@/utils/formatter/percent'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'

export const VotesSummaryDoughnutChart = ({ votes, yesPercent, noPercent }) => {
  const { locale } = useLanguageContext()

  const { i18n } = useLingui()

  const yesData = {
    // labels: ["Red", "Blue"],
    datasets: [
      {
        label: t(i18n)`# of Votes`,
        data: [noPercent, yesPercent],
        backgroundColor: ['#DEEAF6', '#0FB88F'],
        borderColor: ['#DEEAF6', '#0FB88F'],
        borderWidth: 1
      }
    ]
  }
  const noData = {
    // labels: ["Red", "Blue"],
    datasets: [
      {
        label: t(i18n)`# of Votes`,
        data: [noPercent, yesPercent],
        backgroundColor: ['#FA5C2F', '#DEEAF6'],
        borderColor: ['#FA5C2F', '#DEEAF6'],
        borderWidth: 1
      }
    ]
  }

  return (
    <>
      <div
        data-testid='doughnut-charts'
        className='flex flex-wrap items-center justify-center gap-8 my-10'
      >
        <div className='relative max-w-fit'>
          <DoughnutChartInsight
            title={t(i18n)`Incident Occurred`}
            percent={formatPercent(yesPercent, locale)}
            amountStaked={votes.yes}
            variant='success'
          />
          <PercentDoughnutChart data={yesData} />
        </div>

        <div className='relative max-w-fit'>
          <DoughnutChartInsight
            title={t(i18n)`False Reporting`}
            percent={formatPercent(noPercent, locale)}
            amountStaked={votes.no}
            variant='error'
          />
          <PercentDoughnutChart data={noData} />
        </div>
      </div>
    </>
  )
}

const DoughnutChartInsight = ({ title, percent, amountStaked, variant }) => {
  const { NPMTokenSymbol } = useAppConstants()

  return (
    <div className='absolute flex flex-col items-center justify-center w-16 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2'>
      <h5
        className={classNames(
          'text-lg font-bold text-center',
          variant === 'success' ? 'text-0FB88F' : 'text-FA5C2F'
        )}
      >
        {title}
      </h5>
      <p className='mt-1'>({percent})</p>
      <p className='opacity-40 whitespace-nowrap overflow-ellipsis'>
        {amountStaked} {NPMTokenSymbol}
      </p>
    </div>
  )
}
