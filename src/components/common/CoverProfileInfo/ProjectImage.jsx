export const ProjectImage = ({ imgSrc, name }) => {
  return (
    <>
      <div className="w-24 h-24 bg-DEEAF6 p-3 border border-B0C4DB rounded-full">
        <img src={imgSrc} alt={name} className="inline-block max-w-full" />
      </div>
    </>
  );
};
