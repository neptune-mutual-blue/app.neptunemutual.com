export const ProjectName = ({ name }) => {
  return (
    <h1
      className='text-lg font-bold capitalize sm:text-display-sm sm:mb-0'
      data-testid='projectname-container'
    >
      {name}
    </h1>
  )
}
