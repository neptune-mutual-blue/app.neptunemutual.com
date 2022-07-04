import Link from "next/link";
import { safeParseBytes32String } from "@/utils/formatter/bytes32String";
import { useCoverOrProductData } from "@/src/hooks/useCoverOrProductData";
import { ProductCard } from "@/common/Cover/ProductCard";
import { CardSkeleton } from "@/common/Skeleton/CardSkeleton";
import { useEffect, useState } from "react";
import { utils } from "@neptunemutual/sdk";

export const ProductCardWrapper = ({
  coverKey,
  productKey,
  progressFgColor = undefined,
  progressBgColor = undefined,
}) => {
  const productInfo = useCoverOrProductData({ coverKey, productKey });

  const cover_id = safeParseBytes32String(coverKey);
  const product_id = safeParseBytes32String(productKey);

  const [productInfoState, setProductInfoState] = useState(null);

  useEffect(() => {
    let ignore = false;

    if (!productInfo?.ipfsData && productInfo?.ipfsHash) {
      utils.ipfs
        .read(productInfo?.ipfsHash)
        .then((info) => {
          if (ignore) return;
          setProductInfoState({
            ...productInfo,
            ipfsData: JSON.stringify(info),
            infoObj: info,
          });
        })
        .catch(console.log);
    } else if (productInfo) {
      setProductInfoState(productInfo);
    }

    return () => {
      ignore = true;
    };
  }, [productInfo]);

  if (!productInfoState) {
    return <CardSkeleton numberOfCards={1} />;
  }

  return (
    <Link href={`/covers/${cover_id}/${product_id}/options`} key={coverKey}>
      <a
        className="rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-4e7dd9"
        data-testid="cover-link"
      >
        <ProductCard
          coverKey={coverKey}
          productKey={productKey}
          productInfo={productInfoState}
          progressFgColor={progressFgColor}
          progressBgColor={progressBgColor}
        />
      </a>
    </Link>
  );
};
