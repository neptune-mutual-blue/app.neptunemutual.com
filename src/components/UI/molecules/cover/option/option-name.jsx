export const CoverOptionName = ({ imgSrc, title }) => {
  return (
    <div className="container mx-auto flex items-center mb-12">
      <div className="w-11 border border-B0C4DB mr-4 rounded-full">
        <img src={imgSrc} alt={title} />
      </div>
      <div>
        <h4 className="text-h4 font-sora font-bold">{title}</h4>
      </div>
    </div>
  );
};
