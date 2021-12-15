import Image from "next/image"

export const CoverHeroImage = ({ imgSrc, title }) => {
  return (
    <div className="w-24 h-24 bg-ash-brand p-3 border border-ash-border mr-6 rounded-full">
      <img src={imgSrc} alt={title} className="inline-block max-w-full" />
    </div>
  );
};
