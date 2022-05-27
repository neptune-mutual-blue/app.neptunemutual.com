export const Hero = ({ children }) => {
  return (
    <div
      className="bg-left bg-cover bg-gradient-bg"
      data-testid="hero-container"
    >
      {children}
    </div>
  );
};
