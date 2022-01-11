export const HeroStat = ({ title, children }) => {
  return (
    <div className="ml-auto text-right">
      <h5 className="font-sora text-h5">{title}</h5>
      <p className="font-semibold text-4e7dd9 text-h2">{children}</p>
    </div>
  );
};
