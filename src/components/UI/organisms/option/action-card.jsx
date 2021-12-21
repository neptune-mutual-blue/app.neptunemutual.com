export const OptionActionCard = ({ title, description, imgSrc }) => {
  return (
    <div className="rounded-4xl h-full hover:bg-ash-border">
      <div className="flex flex-col items-center">
        <div className="relative py-12">
          <div className="rounded-full w-[153px] h-[153px]"
            style={{
              backgroundColor: "#E6F0FE",
              boxShadow: "0px 4px 64px rgba(78, 125, 217, 0.4)"
            }}
          >
            <img src={imgSrc} className="inline-block max-w-full max-h-full" />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <h4 className="text-h3 font-sora font-semibold">{title}</h4>
          <p className="text-para text-dimmed-card text-center mt-1 px-11">{description}</p>
        </div>
      </div>
    </div>
  );
};
