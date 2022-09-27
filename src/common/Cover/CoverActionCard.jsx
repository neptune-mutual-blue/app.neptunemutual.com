import { OutlinedCard } from '@/common/OutlinedCard/OutlinedCard'

export const CoverActionCard = ({ title, description, imgSrc }) => {
  return (
    <OutlinedCard className='px-4 py-6 bg-white xl:p-10' type='link'>
      <div className='flex items-center'>
        <div className='ml-2 mr-4 md:ml-0 md:mr-6'>
          <div className='flex items-center justify-center w-16 h-16 p-4 rounded-full md:w-24 md:h-24 bg-DEEAF6'>
            <img
              src={imgSrc}
              alt={title}
              className='inline-block max-w-full max-h-full'
            />
          </div>
        </div>
        <div>
          <h4 className='text-h5 xl:text-h4 font-sora'>{title}</h4>
          <p className='mt-1 text-sm xl:text-h5 text-89A0C2'>{description}</p>
        </div>
      </div>
    </OutlinedCard>
  )
}
