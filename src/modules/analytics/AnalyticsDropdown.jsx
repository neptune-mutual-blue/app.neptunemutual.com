import { useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'

const DROPDOWN_OPTIONS = [
  { label: 'Quick Info', value: 'Quick Info', type: 'option' },
  { label: 'Growth', value: 'Growth', type: 'label' },
  { label: 'Demand', value: 'Demand', type: 'option' },
  { label: 'Cover TVL', value: 'Cover TVL', type: 'option' },
  { label: 'Pool TVL', value: 'Pool TVL', type: 'option' },
  { label: 'Other Insights', value: 'Other Insights', type: 'label' },
  { label: 'Top Accounts', value: 'Top Accounts', type: 'option' },
  { label: 'Premium Earned', value: 'Premium Earned', type: 'option' },
  { label: 'Cover Earnings', value: 'Cover Earnings', type: 'option' },
  { label: 'In Consensus', value: 'In Consensus', type: 'option' }
]

export const AnalyticsDropdown = () => {
  const [selectedOption, setSelectedOption] = useState(DROPDOWN_OPTIONS[0])
  return (
    <Listbox value={selectedOption} onChange={setSelectedOption}>
      <Listbox.Button>{selectedOption.label}</Listbox.Button>
      <Transition
        enter='transition duration-100 ease-out'
        enterFrom='transform scale-95 opacity-0'
        enterTo='transform scale-100 opacity-100'
        leave='transition duration-75 ease-out'
        leaveFrom='transform scale-100 opacity-100'
        leaveTo='transform scale-95 opacity-0'
      >
        <Listbox.Options>
          {DROPDOWN_OPTIONS.map((item) => (
            <Listbox.Option
              key={item.value}
              value={item.value}
            >
              {item.label}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Transition>
    </Listbox>
  )
}
