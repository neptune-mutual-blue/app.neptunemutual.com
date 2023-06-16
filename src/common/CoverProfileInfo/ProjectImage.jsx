import { useState } from 'react'

export const ProjectImage = ({ imgSrc, name }) => {
  const [imgUrl, setImgUrl] = useState(imgSrc)

  return (
    <>
      <div
        className='w-[86px] sm:w-24 h-[86px] sm:h-24 bg-DEEAF6 p-3 border border-B0C4DB rounded-full'
        data-testid='projectimage-container'
      >
        <img
          src={imgUrl}
          alt={name}
          className='inline-block max-w-full'
          onError={() => { return setImgUrl('/images/covers/empty.svg') }}
        />
      </div>
    </>
  )
}
