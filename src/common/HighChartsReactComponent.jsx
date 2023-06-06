import { forwardRef } from 'react'

import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts/highstock.src'
import HighchartsExporting from 'highcharts/modules/exporting'

if (typeof Highcharts === 'object') {
  // @ts-ignore
  HighchartsExporting(Highcharts)
}

/** @type {HighchartsReact} */
export const HighchartsReactComponent = forwardRef((props, ref) => {
  return (
    <HighchartsReact
      highcharts={Highcharts}
      ref={ref}
      {...props}
    />
  )
})

HighchartsReactComponent.displayName = 'HighchartsReactComponent'

export const CustomHighcharts = Highcharts
