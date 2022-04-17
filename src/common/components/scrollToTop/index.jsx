import ScrollToTopArrow from "@/icons/ScrollToTopArrow";
import { classNames } from "@/utils/classnames";
import React, { useEffect, useState } from "react";

export const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const showButton = () => {
    const currentPosition = document.documentElement.scrollTop;
    if (currentPosition > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollViewportToTop = () => {
    window.scrollTo({
      top: 0,
      behaviour: "smooth",
    });
  };
  useEffect(() => {
    window.addEventListener("scroll", showButton);

    return () => {
      window.removeEventListener("scroll", showButton);
    };
  }, []);

  return (
    <button
      onClick={scrollViewportToTop}
      className={classNames(
        "flex md:hidden w-8 h-7 bg-black opacity-50 fixed bottom-8 right-4 justify-center items-center rounded-md",
        !isVisible && "hidden"
      )}
    >
      <ScrollToTopArrow />
    </button>
  );
};
