import styles from './Slider.module.css'

const Slider = ({ label, value, min, max, onChange, id = 'slider-range' }) => {
  return (
    <div>
      <label className='text-md font-semibold block mb-4' htmlFor={id}>{label}</label>
      <input
        id={id} min={min} max={max} step={1} type='range' value={value} onChange={(e) => {
          onChange(e.target.value)
        }} className={styles.slider}
      />
    </div>
  )
}

export default Slider
