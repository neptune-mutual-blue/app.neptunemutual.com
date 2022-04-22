import { t } from "@lingui/macro";

export const HeaderLogo = () => {
  return (
    <picture>
      <img
        loading="lazy"
        alt={t`Neptune Mutual`}
        srcSet="/logos/neptune-mutual-inverse-full.svg"
        className="h-9"
      />
    </picture>
  );
};
