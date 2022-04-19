export const HeroStat = ({ title, children }) => {
  return (
    <div className="w-full lg:w-auto mt-11 lg:mt-0 pt-6 lg:pt-0 border-t border-B0C4DB lg:border-0 md:ml-auto text-center lg:text-right">
      <h5 className="font-sora text-h5">{title}</h5>
      <p className="font-semibold text-4e7dd9 text-h2">{children}</p>
    </div>
  );
};
