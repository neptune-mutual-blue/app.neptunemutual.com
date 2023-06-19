export const OutlineButtonList = (props) => {
  const { options, selected, onChange } = props

  return (
    <div className='flex flex-wrap'>
      {options.map(option => {
        return (
          <div
            onClick={() => {
              onChange(option.value)
            }} className={`cursor-pointer py-2 px-4 text-sm leading-4.5 first-of-type:rounded-l-lg last-of-type:rounded-r-lg ${selected === option.value ? 'bg-4E7DD9 text-white' : 'bg-E6EAEF text-black'}`} key={option.value} role='checkbox' aria-checked={selected === option.value}
          >
            {option.label}
          </div>
        )
      })}
    </div>
  )
}
