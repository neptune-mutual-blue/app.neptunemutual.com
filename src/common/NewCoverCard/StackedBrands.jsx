export const StackedBrands = ({ brands }) => {
  return (
    <div className="flex items-center">
      <div className="w-10 h-10 bg-white rounded-full p-3px">
        <img
          src={brands[0].src}
          alt={brands[0].name}
          className="rounded-full"
        />
      </div>
      {brands.length > 1 &&
        brands.slice(1, 4).map((brand, idx) => (
          <div
            className="w-10 h-10 -ml-3 bg-white rounded-full p-3px"
            key={idx}
          >
            <img src={brand.src} alt={brand.name} className="rounded-full" />
          </div>
        ))}
    </div>
  );
};
