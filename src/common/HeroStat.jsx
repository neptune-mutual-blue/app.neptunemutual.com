export const HeroStat = ({ title, children, ...rest }) => {
  return (
    <div
      className="w-full pt-6 text-center border-t lg:w-auto mt-11 md:mt-0 md:pt-0 border-B0C4DB md:border-0 md:ml-auto lg:text-right"
      {...rest}
    >
      <h5 className="font-sora text-h5">{title}</h5>
      <p className="font-semibold text-4e7dd9 text-h2">{children}</p>
    </div>
  );
};
