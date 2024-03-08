export const HeaderLogo = () => {
  return (
    <picture data-testid='header-logo'>
      <img
        loading='lazy'
        alt='Neptune Mutual'
        srcSet='/logos/neptune-mutual-inverse-full-beta.svg'
        className='hidden w-full h-8 md:h-9 md:block'
        data-testid='header-logo'
      />

      <img
        loading='lazy'
        alt='Neptune Mutual'
        srcSet='/logos/neptune-mutual-inverse.svg'
        className='block h-8 md:h-9 md:hidden'
        data-testid='header-logo'
      />
    </picture>
  )
}
