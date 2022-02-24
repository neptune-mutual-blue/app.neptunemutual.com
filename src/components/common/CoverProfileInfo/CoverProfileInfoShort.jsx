import { classNames } from "@/utils/classnames";

export const CoverProfileInfoShort = ({
  imgSrc,
  title,
  className,
  fontSizeClass = "text-h4",
}) => {
  return (
    <div
      className={classNames(
        "container mx-auto flex items-center mb-12",
        className
      )}
    >
      <div className="w-11 border border-B0C4DB mr-4 rounded-full">
        <img src={imgSrc} alt={title} />
      </div>
      <div>
        <h4 className={classNames("font-sora font-bold", fontSizeClass)}>
          {title}
        </h4>
      </div>
    </div>
  );
};
