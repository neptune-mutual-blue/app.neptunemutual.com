export const ProjectName = ({ name }) => {
  return (
    <h1
      className="mb-2 font-bold capitalize text-h4 sm:text-h2 font-sora sm:mb-0"
      data-testid="projectname-container"
    >
      {name}
    </h1>
  );
};
