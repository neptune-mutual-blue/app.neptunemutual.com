import ScrollToTopArrow from "@/icons/ScrollToTopArrow";
import React from "react";

export const ScrollToTopButton = () => {
  const scrollMeToTop = () => {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  };

  return (
    <div
      onClick={scrollMeToTop}
      className="md:hidden w-8 h-7 bg-[#01052D80] absolute bottom-8 right-4 flex justify-center items-center rounded-md"
    >
      <ScrollToTopArrow />
    </div>
  );
};
