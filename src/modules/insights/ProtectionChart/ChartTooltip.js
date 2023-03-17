import { toFont } from 'chart.js/helpers'

const getOrCreateTooltip = (chart, className) => {
  let tooltipEl = chart.canvas.parentNode.querySelector('div#chart-tooltip')

  if (!tooltipEl) {
    tooltipEl = document.createElement('div')
    tooltipEl.setAttribute('id', 'chart-tooltip')
    tooltipEl.setAttribute(
      'class',
      `bg-FEFEFF bg-opacity-95 px-3.5 py-9px border border-B0C4DB rounded-big shadow-hc-tooltip ${className}`
    )
    tooltipEl.style.opacity = 1
    tooltipEl.style.pointerEvents = 'none'
    tooltipEl.style.position = 'absolute'
    tooltipEl.style.transition = 'all .1s ease'

    chart.canvas.parentNode.appendChild(tooltipEl)
  }

  return tooltipEl
}

const externalTooltipHandler = (context, className = '') => {
  // Tooltip Element
  const { chart, tooltip } = context
  const tooltipEl = getOrCreateTooltip(chart, className)

  // Hide if no tooltip
  if (tooltip.opacity === 0) {
    tooltipEl.style.opacity = 0
    return
  }

  tooltipEl.style.opacity = 1

  let innerHTML = ''

  if (tooltip.title?.length) {
    innerHTML += `${tooltip.title.join('')}`
  }

  if (tooltip.body) {
    innerHTML += `${tooltip.body[0].lines[0]}`
  }

  if (tooltip.footer?.length) {
    innerHTML += `${tooltip.footer.join('')}`
  }

  tooltipEl.innerHTML = innerHTML

  const mainRect = window.innerWidth < 600
    ? document.querySelector('main').getBoundingClientRect()
    : document.getElementById('__next').getBoundingClientRect()
  const canvasRect = context.chart.canvas.getBoundingClientRect()
  const tooltipRect = tooltipEl.getBoundingClientRect()

  let left = canvasRect.left + tooltip.caretX
  const top = canvasRect.top - mainRect.top + tooltip.caretY

  if ((left + tooltipRect.width) > canvasRect.right) {
    left = canvasRect.right - tooltipRect.width
  }

  if (window.innerWidth >= 768) {
    tooltipEl.style.transform = (left < 250) ? 'translateX(0%)' : 'translateX(-50%)'
  }

  tooltipEl.style.left = left + 'px'
  tooltipEl.style.top = top + 'px'

  const bodyFont = toFont(tooltip.options.bodyFont)
  // Display, position, and set styles for font
  tooltipEl.style.opacity = 1
  tooltipEl.style.position = 'absolute'
  tooltipEl.style.minWidth = '175px'
  tooltipEl.style.font = bodyFont.string
  tooltipEl.style.padding = tooltip.padding + 'px ' + tooltip.padding + 'px'
  tooltipEl.style.pointerEvents = 'none'
}

export { externalTooltipHandler }
