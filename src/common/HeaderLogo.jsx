export const HeaderLogo = () => {
  return (
    <picture data-testid='header-logo'>
      <img
        loading='lazy'
        alt='Neptune Mutual'
        srcSet='/logos/neptune-mutual-inverse-full-beta.svg'
        className='w-full h-9'
        data-testid='header-logo'
      />
    </picture>
  )
}
