import { classNames } from "@/utils/classnames";

export const Hero = ({ children, className = "" }) => {
  return (
    <div
      data-testid="hero-container"
      className={classNames("bg-left bg-cover bg-gradient-bg", className)}
    >
      {children}
    </div>
  );
};
