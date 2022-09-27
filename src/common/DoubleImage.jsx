export const DoubleImage = ({ images }) => {
  const { src: src1, alt: alt1 } = images[0]
  const { src: src2, alt: alt2 } = images[1]

  return (
    <div className='p-3 relative inline-block'>
      <div className='border border-black rounded-full w-10 h-10 flex justify-center items-center'>
        <img src={src1} alt={alt1} className='inline-block ' />
      </div>
      <div className='absolute -top-1 -right-4 border border-white rounded-full w-10 h-10 flex justify-center items-center'>
        <img src={src2} alt={alt2} />
      </div>
    </div>
  )
}
