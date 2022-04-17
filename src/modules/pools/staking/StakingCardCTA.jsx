import { RegularButton } from "@/src/common/components/button/regular";
import { classNames } from "@/utils/classnames";

export const StakingCardCTA = ({ children, onClick, className }) => (
  <RegularButton
    onClick={onClick}
    className={classNames(
      "w-full font-semibold uppercase text-sm py-2",
      className
    )}
  >
    {children}
  </RegularButton>
);
