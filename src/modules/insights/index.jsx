import { Container } from '@/common/Container/Container'
import { Hero } from '@/common/Hero'
import { CalculatorCard } from '@/modules/insights/CalculatorCard'
import { InsightsContent } from '@/modules/insights/InsightsContent'
import { InsightsErrorBoundary } from '@/modules/insights/InsightsErrorBoundary'
import { classNames } from '@/utils/classnames'

export const Insights = () => {
  return (
    <Hero big>
      <Container className='flex flex-col justify-between gap-8 px-4 py-8 lg:gap-8 md:py-16 md:px-6 lg:flex-row lg:py-28 lg:px-8'>
        <div className='grid grid-cols-1 grid-rows-analytics-card w-full bg-white rounded-2xl shadow-homeCard px-4 py-4 lg:p-10 border-0.5 border-B0C4DB'>
          <InsightsErrorBoundary fallback={<div className='text-center'><i>Something went wrong.</i></div>}>
            <InsightsContent />
          </InsightsErrorBoundary>
        </div>
        <div className={classNames('-mt-4 mb-4 lg:m-0 md:flex lg:flex-col lg:gap-4 md:w-full lg:w-auto lg:pt-0 lg:h-full shadow-homeCard',
          'bg-white border-0.5 border-B0C4DB rounded-2xl')}
        >
          <div className='flex-1 lg:flex-2 lg:flex lg:flex-col'>
            <div
              className='flex flex-col md:justify-center lg:justify-start lg:flex-1'
              data-testid='tvl-homecard'
            >
              <div
                className={classNames(
                  'w-full lg:w-96 lg:h-full md:rounded-none flex flex-col',
                  'p-4 m-0 lg:p-10'
                )}
              >
                <CalculatorCard />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Hero>
  )
}
