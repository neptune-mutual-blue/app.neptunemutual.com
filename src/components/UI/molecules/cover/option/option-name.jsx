export const CoverOptionName = ({ imgSrc, title }) => {
  return (
    <div className="container mx-auto flex items-center mb-24">
      <div className="w-11 h-11 bg-ash-brand p-1 border border-ash-border mr-4 rounded-full">
        <img src={imgSrc} alt={title} />
      </div>
      <div>
        <h4 className="text-h4 font-sora font-bold">
          {title}
        </h4>
      </div>
    </div>
  )
}