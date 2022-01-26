export const SingleImage = ({ src, alt }) => {
  return (
    <>
      <div className="border bg-DEEAF6 border-B0C4DB rounded-full w-18 h-18 flex justify-center items-center">
        <img src={src} alt={alt} className="inline-block" />
      </div>
    </>
  );
};
