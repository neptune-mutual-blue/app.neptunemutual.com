import { classNames } from '@/utils/classnames'
import * as Tooltip from '@radix-ui/react-tooltip'

/**
 *
 * @param {Object} params
 * @param {React.ReactNode} params.children
 * @param {React.ReactNode | string} params.infoComponent
 * @param {string} [params.className]
 * @param {"top" | "right" | "bottom" | "left"} [params.position]
 * @param {number} [params.positionOffset]
 * @param {"start" | "center" | "end"} [params.align]
 * @param {number} [params.alignOffset]
 * @param {boolean} [params.arrow]
 * @param {number} [params.arrowOffset]
 * @param {number} [params.delayDuration]
 * @param {boolean} [params.disabled]
 * @returns
 */
export const InfoTooltip = ({
  children,
  infoComponent,
  className = '',
  position = 'top',
  positionOffset = 5,
  align = 'center',
  alignOffset = 0,
  arrow = true,
  arrowOffset = 4,
  delayDuration = 200,
  disabled = false
}) => {
  return (
    <Tooltip.Root delayDuration={delayDuration}>
      <Tooltip.Trigger asChild={!disabled} disabled={disabled}>
        {children}
      </Tooltip.Trigger>
      <Tooltip.Content
        className={classNames(
          'flex flex-col gap-y-1 text-xs leading-5 max-w-56 text-white bg-black bg-opacity-90 z-60 rounded-1 shadow-tx-overview',
          className || 'p-4'
        )}
        side={position}
        sideOffset={positionOffset}
        alignOffset={alignOffset}
        align={align}
      >
        {arrow && (
          <Tooltip.Arrow
            className=''
            offset={arrowOffset}
            fill='#01052D'
            height={7}
          />
        )}
        {infoComponent}
      </Tooltip.Content>
    </Tooltip.Root>
  )
}
