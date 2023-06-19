import { classNames } from '@/utils/classnames'

const LeftArrow = (props) => {
  return (
    <svg
      width='17' height='9' viewBox='0 0 17 9'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={classNames(
        props.variant === 'right' ? 'ml-2 rotate-180' : 'mr-2',
        props.className
      )}
      {...props}
    >
      <path d='M0.646447 4.14645C0.451184 4.34171 0.451184 4.65829 0.646447 4.85355L3.82843 8.03553C4.02369 8.2308 4.34027 8.2308 4.53553 8.03553C4.7308 7.84027 4.7308 7.52369 4.53553 7.32843L1.70711 4.5L4.53553 1.67157C4.7308 1.47631 4.7308 1.15973 4.53553 0.964466C4.34027 0.769204 4.02369 0.769204 3.82843 0.964466L0.646447 4.14645ZM1 5H17V4H1V5Z' fill='currentColor' />
    </svg>

  )
}

export default LeftArrow
