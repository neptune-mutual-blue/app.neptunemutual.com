export const HeaderLogo = () => {
  return (
    <picture>
      <source
        sizes="548px"
        media="(min-width: 768px)"
        srcSet="/logos/neptune-mutual-inverse-full.png 548w"
      />
      <img
        loading="lazy"
        alt="Neptune Mutual"
        srcSet="/logos/neptune-mutual-inverse.png 100w"
        className="h-9"
      />
    </picture>
  );
};
