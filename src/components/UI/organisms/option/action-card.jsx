export const OptionActionCard = ({ title, description, imgSrc }) => {
  return (
    <>
      <div className="flex justify-center items-center bg-DEEAF6 lg:bg-white group-hover:bg-DEEAF6 group-focus:bg-DEEAF6 rounded-full w-18 h-18 md:w-32 md:h-32 lg:w-40 lg:h-40 p-7 mx-auto">
        <img
          id="actionCard"
          src={imgSrc}
          alt={title}
          className="mx-auto object-contain"
        />
      </div>
      <h4 className="text-h7 md:text-h4 lg:text-h3 lg:px-2 text-center font-sora font-semibold mt-4 md:mt-6 lg:mt-14">
        {title}
      </h4>
      <p className="text-7398C0 text-h7 md:text-h5 text-center mt-1 px-4 md:px-16 lg:px-11">
        {description}
      </p>
    </>
  );
};
