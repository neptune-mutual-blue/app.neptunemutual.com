export const SingleImage = ({ src, alt }) => {
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
        <img className="" src={src} alt={alt} />
      </div>
    </>
  );
};
