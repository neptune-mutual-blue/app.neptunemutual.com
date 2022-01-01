export const Hero = ({ children }) => {
  return (
    <div
      style={{
        backgroundImage: "url(/gradient.png)",
        backgroundSize: "cover",
        backgroundPosition: "left",
      }}
    >
      {children}
    </div>
  );
};
