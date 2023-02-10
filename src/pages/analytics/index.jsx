import { Container } from '@/common/Container/Container'
import { Hero } from '@/common/Hero'
import { HomeCard } from '@/common/HomeCard/HomeCard'
import { BarChart } from '@/modules/analytics/BarChart'
import { classNames } from '@/utils/classnames'
import React from 'react'

function AnalyticsPage () {
  return (
    <main>
      <Hero big>

        <Container
          className={classNames(
            'flex flex-col-reverse justify-between lg:gap-8 py-10 md:py-16 md:px-8 lg:py-28 md:flex-col-reverse lg:flex-row'
          )}
        >
          <div className='pt-10 md:flex lg:flex-col md:gap-4 md:w-full lg:w-auto lg:pt-0'>
            <div className='flex-1 lg:flex-2 lg:flex lg:flex-col'>
              <div
                className='flex mb-2 md:mb-0 lg:mb-8 md:justify-center lg:justify-start lg:flex-1'
                data-testid='tvl-homecard'
              >
                <HomeCard
                  items={[
                    {
                      name: 'Capacity',
                      amount: '$50.24M'
                    },
                    {
                      name: 'Capacity',
                      amount: '$50.24M'
                    }
                  ]}
                  className='md:border-0.5 md:border-B0C4DB md:rounded-tl-xl md:rounded-tr-xl'
                />
              </div>
              <div
                className='flex mb-2 md:mb-0 lg:mb-8 md:justify-center lg:justify-start lg:flex-1'
                data-testid='tvl-homecard'
              >
                <HomeCard
                  items={[
                    {
                      name: 'Capacity',
                      amount: '$50.24M'
                    },
                    {
                      name: 'Capacity',
                      amount: '$50.24M'
                    }
                  ]}
                  className='md:border-0.5 md:border-B0C4DB md:rounded-tl-xl md:rounded-tr-xl'
                />
              </div>
              <div
                className='flex mb-2 md:mb-0 lg:mb-8 md:justify-center lg:justify-start lg:flex-1'
                data-testid='tvl-homecard'
              >
                <HomeCard
                  items={[
                    {
                      name: 'Capacity',
                      amount: '$50.24M'
                    },
                    {
                      name: 'Capacity',
                      amount: '$50.24M'
                    }
                  ]}
                  className='md:border-0.5 md:border-B0C4DB md:rounded-tl-xl md:rounded-tr-xl'
                />
              </div>
            </div>
          </div>

          <div className='flex flex-col flex-1 min-w-0 bg-white rounded-2xl shadow-homeCard px-6 py-8 lg:p-10 border-0.5 border-B0C4DB'>
            <div className='mb-8'>
              <h1 className='mb-1 font-bold text-h2'>
                Analytics
              </h1>
            </div>
            <div
              className='flex-1 min-h-360'
            >
              <BarChart />
            </div>
          </div>
        </Container>
        <hr className='border-b border-B0C4DB' />
      </Hero>
    </main>
  )
}

export default AnalyticsPage
