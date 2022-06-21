import Link from "next/link";
import { useRouter } from "next/router";
import { OptionActionCard } from "@/common/Option/OptionActionCard";
import { Container } from "@/common/Container/Container";
import { classNames } from "@/utils/classnames";
import { Trans } from "@lingui/macro";
import {
  renderTitleTranslation,
  renderDescriptionTranslation,
} from "@/utils/translations";
import { safeFormatBytes32String } from "@/utils/formatter/bytes32String";
import { BackButton } from "@/common/BackButton/BackButton";
import { actions as coverActions } from "@/src/config/cover/actions";
import { useFetchProductInfo } from "@/src/hooks/useFetchProductInfo";

export const CoverOptionsPage = () => {
  const router = useRouter();
  const { product_id, cover_id } = router.query;
  const coverKey = safeFormatBytes32String(cover_id);
  const productKey = safeFormatBytes32String(product_id || "");

  const product = useFetchProductInfo(coverKey, productKey);

  if (!product) {
    return <Trans>loading...</Trans>;
  }

  return (
    <div className="min-h-screen py-6 md:px-2 lg:px-8">
      <Container className="pb-16">
        <h2 className="mb-4 font-bold text-center text-h4 md:text-h3 lg:text-h2 font-sora md:mb-6 lg:mb-12">
          <Trans>I Want to</Trans>
        </h2>
        <div className="container grid grid-cols-2 gap-4 mx-auto mb-6 justify-items-center lg:gap-8 sm:grid-cols-2 lg:grid-cols-4 md:mb-8 lg:mb-14">
          {Object.entries(coverActions).map(
            ([actionKey, { title, description, imgSrc, smImgSrc, action }]) => {
              const href =
                action === "active"
                  ? "/my-policies/active"
                  : `/covers/${cover_id}/${product_id}/${action}`;
              return (
                <Link key={actionKey} href={href}>
                  <a
                    data-testid="cover-option-actions"
                    className={classNames(
                      "rounded-2xl md:rounded-3xl group py-10 md:py-12 h-full w-full transition duration-300 ease-out",
                      "hover:border-B0C4DB hover:ease-in hover:border-0.5 hover:border-solid  hover:shadow-option  hover:box-border hover:rounded-3xl  hover:bg-white",
                      "focus:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-4e7dd9",
                      "border-B0C4DB border-0.5 box-border bg-white lg:bg-transparent lg:border-none max-w-sm"
                    )}
                  >
                    <OptionActionCard
                      title={renderTitleTranslation(title)}
                      description={renderDescriptionTranslation(description)}
                      imgSrc={imgSrc}
                      smImgSrc={smImgSrc}
                    />
                  </a>
                </Link>
              );
            }
          )}
        </div>
        <div className="flex justify-center">
          <BackButton onClick={() => router.back()} />
        </div>
      </Container>
    </div>
  );
};
