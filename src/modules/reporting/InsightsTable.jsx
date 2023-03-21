import { classNames } from '@/utils/classnames'

export const InsightsTable = ({ insights = [] }) => {
  return (
    <>
      <table className='w-full text-sm'>
        <tbody>
          {insights.map((insight) => {
            return (
              <tr key={insight.title}>
                <InsightsTh
                  className={classNames(
                    insight.variant === 'success' && 'text-md text-0FB88F',
                    insight.variant === 'error' && 'text-md text-FA5C2F',
                    !insight.variant && 'opacity-50'
                  )}
                >
                  {insight.title}
                </InsightsTh>
                <InsightsTd htmlTooltip={insight.htmlTooltip}>
                  {insight.value}
                </InsightsTd>
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  )
}

const InsightsTh = ({ children, className }) => {
  return (
    <th
      scope='row'
      className={classNames(
        'text-left py-1 font-normal leading-none whitespace-nowrap',
        className
      )}
    >
      {children}
    </th>
  )
}

const InsightsTd = ({ children, className = '', htmlTooltip = '' }) => {
  return (
    <td
      className={classNames(
        'text-right py-1 text-404040 whitespace-nowrap',
        className
      )}
      title={htmlTooltip}
    >
      {children}
    </td>
  )
}
