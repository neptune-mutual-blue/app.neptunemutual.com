import { classNames } from "@/utils/classnames";
import { useState, useEffect } from "react";

const SeeMoreParagraph = ({ children }) => {
  const [seeMoreVisible, setSeeMoreVisible] = useState(false);
  const [changeClass, setChangeClass] = useState(false);

  useEffect(() => {
    if (children.length > 194) setSeeMoreVisible(true);
  }, [children]);

  const handleReadMore = (e) => {
    e.preventDefault();
    setChangeClass((prev) => !prev);
  };
  return (
    <div>
      <p
        className={classNames("h-14 overflow-hidden", changeClass && "h-auto")}
      >
        {children}
      </p>

      {/* Read more */}
      {seeMoreVisible && (
        <a
          onClick={(e) => handleReadMore(e)}
          className="opacity-40 hover:underline mt-4 cursor-pointer"
        >
          See{changeClass ? " Less" : " More"}
        </a>
      )}
    </div>
  );
};

export default SeeMoreParagraph;
