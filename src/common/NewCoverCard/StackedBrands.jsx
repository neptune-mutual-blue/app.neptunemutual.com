import { classNames } from "@/utils/classnames";

export const StackedBrands = ({ brands }) => {
  const Image = ({ src, alt, className = "" }) => (
    <div
      className={classNames(
        "w-10 h-10 bg-white rounded-full p-2.5px overflow-hidden",
        className
      )}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full rounded-full bg-DEEAF6"
      />
    </div>
  );

  return (
    <div className="flex items-center">
      <Image src={brands[0].src} alt={brands[0].name} />
      {brands.length > 1 &&
        brands
          .slice(1, 4)
          .map((brand, idx) => (
            <Image
              key={idx}
              src={brand.src}
              alt={brand.name}
              className="-ml-3"
            />
          ))}
    </div>
  );
};
