import { Switch } from '@headlessui/react'

export function Toggle ({ enabled, setEnabled }) {
  return (
    <div className='' data-testid='toggle-container'>
      <Switch
        checked={enabled}
        onChange={setEnabled}
        className={`${enabled ? 'bg-primary' : 'bg-B0C4DB'}
          relative inline-flex flex-shrink-0 h-4 w-8 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
        data-testid='switch-component'
      >
        <span className='sr-only'>Use setting</span>
        <span
          aria-hidden='true'
          className={`${enabled ? 'translate-x-4' : 'translate-x-0'}
            pointer-events-none inline-block h-3 w-3 rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200`}
        />
      </Switch>
    </div>
  )
}
