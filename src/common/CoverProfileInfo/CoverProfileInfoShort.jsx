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
      data-testid="cover-profile-info-short"
    >
      <div className="mr-4 border rounded-full w-11 border-B0C4DB">
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
