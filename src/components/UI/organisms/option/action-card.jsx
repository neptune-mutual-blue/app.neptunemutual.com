export const OptionActionCard = ({ title, description, imgSrc }) => {
  return (
    <>
      <div className="flex justify-center items-center">
        <img
          src={imgSrc}
          alt={title}
          className="w-40 h-40 bg-e6f0fe inline-block rounded-full mx-auto shadow-actionCard"
        />
      </div>
      <h4 className="text-h3 text-center font-sora font-semibold mt-12">
        {title}
      </h4>
      <p className="text-7398C0 text-center mt-1 px-11">{description}</p>
    </>
  );
};
