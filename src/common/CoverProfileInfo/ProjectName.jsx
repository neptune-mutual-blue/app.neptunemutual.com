export const ProjectName = ({ name }) => {
  return (
    <h1
      className='mb-2 font-bold capitalize text-lg sm:text-display-sm sm:mb-0'
      data-testid='projectname-container'
    >
      {name}
    </h1>
  )
}
