import { classNames } from "@/utils/classnames";
import { useEffect, useRef, useState } from "react";

export const SeeMoreParagraph = ({ text = "" }) => {
  const [showFullText, setShowFullText] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const wrapperRef = useRef(null);
  const elementRef = useRef(null);

  const handleReadMore = () => {
    setShowFullText((prev) => !prev);
  };

  useEffect(() => {
    setHasOverflow(
      wrapperRef.current &&
        elementRef.current &&
        elementRef.current.scrollHeight > wrapperRef.current.offsetHeight
    );
  }, [text]);

  return (
    <>
      <div
        ref={wrapperRef}
        className={classNames(!showFullText && "h-14 overflow-hidden")}
      >
        <p ref={elementRef}>{text}</p>
      </div>

      {/* Read more */}
      {hasOverflow && (
        <button
          onClick={handleReadMore}
          className="opacity-40 underline hover:no-underline mt-4 cursor-pointer capitalize"
        >
          See {showFullText ? "less" : "more"}
        </button>
      )}
    </>
  );
};
