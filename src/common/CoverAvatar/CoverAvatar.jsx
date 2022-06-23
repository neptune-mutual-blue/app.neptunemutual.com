import { getCoverImgSrc } from "@/src/helpers/cover";
import React from "react";
import { classNames } from "@/utils/classnames";
import { Trans } from "@lingui/macro";

export const CoverAvatar = ({ coverInfo }) => {
  const { coverKey, productKey, infoObj = {}, products = [] } = coverInfo || {};
  const { coverName, productName } = infoObj;

  const isDiversified = products?.length > 0;
  const isProduct = Boolean(productKey);
  const policyCoverKey = isProduct ? productKey : coverKey;
  const policyCoverName = isProduct ? productName : coverName;

  const imgSrc = isProduct
    ? "/images/covers/empty.svg"
    : getCoverImgSrc({ key: policyCoverKey });
  const productsImg = isDiversified
    ? products?.map((item) => getCoverImgSrc({ key: item.productKey }))
    : [];
  const slicedProductsImg = isDiversified ? productsImg.slice(0, 3) : [];

  return (
    <div className="relative flex grow items-center">
      {slicedProductsImg.length ? (
        slicedProductsImg.slice(0, 3).map((item, idx) => {
          const more = productsImg.length - 3;
          return (
            <React.Fragment key={item}>
              <div
                className={classNames(
                  "inline-block max-w-full bg-FEFEFF rounded-full w-14 lg:w-18",
                  idx !== 0 && "-ml-7 lg:-ml-9 p-0.5"
                )}
              >
                <img
                  // src={item}
                  src="/images/covers/empty.svg"
                  alt={products[idx].productName}
                  className="bg-DEEAF6 rounded-full"
                  data-testid="cover-img"
                />
              </div>

              {idx === slicedProductsImg.length - 1 && more > 0 && (
                <p className="ml-2 opacity-40 text-01052D text-xs">
                  +{more} <Trans>MORE</Trans>
                </p>
              )}
            </React.Fragment>
          );
        })
      ) : (
        <div
          className={classNames(
            "inline-block max-w-full bg-FEFEFF rounded-full w-14 lg:w-18"
          )}
        >
          <img
            src={imgSrc}
            alt={policyCoverName}
            className="bg-DEEAF6 rounded-full"
            data-testid="cover-img"
          />
        </div>
      )}
    </div>
  );
};
