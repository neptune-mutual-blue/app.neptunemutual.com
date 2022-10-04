import { classNames } from '@/utils/classnames'

export const Hero = ({ children, className = '', big = false }) => {
  const bgGradient = big ? 'bg-gradient-big' : ' bg-gradient-slim'

  return (
    <div
      data-testid='hero-container'
      className={classNames('bg-left bg-cover', bgGradient, className)}
    >
      {children}
    </div>
  )
}
