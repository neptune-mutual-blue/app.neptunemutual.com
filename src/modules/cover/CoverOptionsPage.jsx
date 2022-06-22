import Link from "next/link";
import { useRouter } from "next/router";
import { actions as coverActions } from "@/src/config/cover/actions";
import { CoverProfileInfoShort } from "@/common/CoverProfileInfo/CoverProfileInfoShort";
import { OptionActionCard } from "@/common/Option/OptionActionCard";
import { Container } from "@/common/Container/Container";
import { getCoverImgSrc, isValidProduct } from "@/src/helpers/cover";
import { classNames } from "@/utils/classnames";
import { Trans } from "@lingui/macro";
import {
  renderTitleTranslation,
  renderDescriptionTranslation,
} from "@/utils/translations";
import { safeFormatBytes32String } from "@/utils/formatter/bytes32String";
import { BackButton } from "@/common/BackButton/BackButton";
import { useCoverOrProductData } from "@/src/hooks/useCoverOrProductData";

export const CoverOptionsPage = () => {
  const router = useRouter();
  const { cover_id, product_id } = router.query;
  const coverKey = safeFormatBytes32String(cover_id);
  const productKey = safeFormatBytes32String(product_id || "");
  const coverInfo = useCoverOrProductData({ coverKey, productKey });

  if (!coverInfo) {
    return <Trans>loading...</Trans>;
  }

  const isDiversified = isValidProduct(productKey);
  const imgSrc = getCoverImgSrc({ key: coverKey });
  const title = isDiversified
    ? coverInfo.infoObj.coverName
    : coverInfo.infoObj.projectName;

  return (
    <div className="min-h-screen py-6 md:px-2 lg:px-8">
      <div className="px-4 mx-auto max-w-7xl sm:px-5 md:px-4">
        <CoverProfileInfoShort
          imgSrc={imgSrc}
          title={title}
          className="mb-7 lg:mb-28"
          fontSizeClass="text-h7 md:text-h4"
        />
      </div>
      <Container className="pb-16">
        <h2 className="mb-4 font-bold text-center text-h4 md:text-h3 lg:text-h2 font-sora md:mb-6 lg:mb-12">
          <Trans>I Want to</Trans>
        </h2>
        <div className="container grid grid-cols-2 gap-4 mx-auto mb-6 justify-items-center lg:gap-8 sm:grid-cols-2 lg:grid-cols-4 md:mb-8 lg:mb-14">
          {Object.keys(coverActions).map((actionKey) => {
            return (
              <Link
                key={actionKey}
                href={coverActions[actionKey].getHref(
                  cover_id,
                  product_id,
                  isDiversified
                )}
              >
                <a
                  data-testid="cover-option-actions"
                  className={classNames(
                    "rounded-2xl md:rounded-3xl group py-10 md:py-12 h-full w-full transition duration-300 ease-out",
                    "hover:border-B0C4DB hover:ease-in hover:border-0.5 hover:border-solid  hover:shadow-option  hover:box-border hover:rounded-3xl  hover:bg-white",
                    "focus:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-4e7dd9",
                    "border-B0C4DB border-0.5 box-border bg-white lg:bg-transparent lg:border-none"
                  )}
                >
                  <OptionActionCard
                    title={renderTitleTranslation(
                      coverActions[actionKey].title
                    )}
                    description={renderDescriptionTranslation(
                      coverActions[actionKey].description
                    )}
                    imgSrc={coverActions[actionKey].imgSrc}
                    smImgSrc={coverActions[actionKey].smImgSrc}
                  />
                </a>
              </Link>
            );
          })}
        </div>
        <div className="flex justify-center">
          <BackButton onClick={() => router.back()} />
        </div>
      </Container>
    </div>
  );
};
