import styles from './Slider.module.css'

const Slider = ({ label, value, min, max, onChange, id = 'slider-range' }) => {
  return (
    <div>
      <label className='block mb-4 font-semibold text-md' htmlFor={id}>{label}</label>
      <input
        id={id} min={min} max={max} step={1} type='range' value={value} onChange={(e) => {
          onChange(e.target.value)
        }} className={styles.slider}
      />
    </div>
  )
}

export default Slider
