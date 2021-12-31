import { RegularButton } from "@/components/UI/atoms/button/regular";
import { classNames } from "@/utils/classnames";

export const StakingCardCTA = ({ children, onClick, className }) => (
  <RegularButton
    onClick={onClick}
    className={classNames(
      "w-full font-semibold uppercase text-sm py-2 mt-6",
      className
    )}
  >
    {children}
  </RegularButton>
);
