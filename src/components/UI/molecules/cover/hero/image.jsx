export const CoverHeroImage = ({ imgSrc, title }) => {
  return (
    <div className="w-24 h-24 bg-DEEAF6 p-3 border border-B0C4DB mr-6 rounded-full">
      <img src={imgSrc} alt={title} className="inline-block max-w-full" />
    </div>
  );
};
