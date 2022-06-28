import { getCoverImgSrc } from "@/src/helpers/cover";
import React from "react";
import { classNames } from "@/utils/classnames";
import { Trans } from "@lingui/macro";

export const CoverAvatar = ({ coverInfo, isDiversified }) => {
  if (!coverInfo) {
    return null;
  }

  const { coverKey, productKey, products } = coverInfo;
  const isCover = Array.isArray(coverInfo.products);

  return (
    <div className="relative flex items-center grow">
      {isDiversified && isCover ? (
        <React.Fragment>
          {products.slice(0, 3).map((item, idx) => {
            const imgSrc = getCoverImgSrc({ key: item.productKey });
            return (
              <div
                className={classNames(
                  "inline-block max-w-full bg-FEFEFF rounded-full w-14 lg:w-18",
                  idx !== 0 && "-ml-7 lg:-ml-9 p-0.5"
                )}
                key={item.id}
              >
                <img
                  src={imgSrc}
                  alt={item.productName}
                  className="rounded-full bg-DEEAF6"
                  data-testid="cover-img"
                />
              </div>
            );
          })}

          {products.length > 3 && (
            <p className="ml-2 text-xs opacity-40 text-01052D">
              +{products.length - 3} <Trans>MORE</Trans>
            </p>
          )}
        </React.Fragment>
      ) : (
        <div
          className={classNames(
            "inline-block max-w-full bg-FEFEFF rounded-full w-14 lg:w-18"
          )}
        >
          <img
            src={getCoverImgSrc({ key: isDiversified ? productKey : coverKey })}
            alt={
              isDiversified
                ? coverInfo.infoObj.productName
                : coverInfo.infoObj.coverName
            }
            className="rounded-full bg-DEEAF6"
            data-testid="cover-img"
          />
        </div>
      )}
    </div>
  );
};
