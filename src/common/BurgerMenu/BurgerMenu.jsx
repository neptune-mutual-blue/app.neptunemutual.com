import { classNames } from '@/utils/classnames'

export const BurgerMenu = ({ isOpen, onToggle, ...rest }) => {
  return (
    <button
      onClick={onToggle}
      className={classNames(
        'h-5 relative xl:hidden',
        isOpen && 'z-20',
        rest.className || ''
      )}
      aria-label='Open or Close the Sidebar'
      title={isOpen ? 'Close Sidebar' : 'Open Sidebar'}
    >
      <div
        className={classNames(
          'w-5 h-0.75 bg-white transition-all duration-500 ease-menu',
          isOpen && 'translate-y-1.5 rotate-45 bg-white my-px'
        )}
      />
      <div
        className={classNames(
          'w-5 h-0.75 mt-1 bg-white transition duration-500 ease-menu',
          isOpen && 'mt-0.25 opacity-0'
        )}
      />
      <div
        className={classNames(
          'w-5 h-0.75 mt-1 bg-white transition-all duration-500 ease-menu',
          isOpen && 'mt-0.5 -translate-y-1.5 -rotate-45 bg-white -my-1'
        )}
      />
    </button>
  )
}
