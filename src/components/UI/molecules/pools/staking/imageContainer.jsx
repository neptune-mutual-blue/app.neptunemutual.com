export const ImageContainer = ({ doubleImage = false, imgSrc, name }) => {
  if (!doubleImage) {
    return (
      <div className="border bg-DEEAF6 border-white rounded-full w-18 h-18 flex justify-center items-center">
        <img src={imgSrc} alt={name} className="inline-block" />
      </div>
    );
  }
  return (
    <>
      <div className="border border-black rounded-full w-10 h-10 flex justify-center items-center">
        <img
          src="/pools/staking/npm.png"
          alt="npm logo"
          className="inline-block "
        />
      </div>
      <div className="absolute -top-1 -right-4 border border-white rounded-full w-10 h-10 flex justify-center items-center">
        <img className="" src={imgSrc} alt={name} />
      </div>
    </>
  );
};
