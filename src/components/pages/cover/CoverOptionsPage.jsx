import Link from "next/link";
import { useRouter } from "next/router";
import { actions as coverActions } from "@/src/config/cover/actions";
import { OutlinedButton } from "@/components/UI/atoms/button/outlined";
import { CoverProfileInfoShort } from "@/components/common/CoverProfileInfo/CoverProfileInfoShort";
import { OptionActionCard } from "@/components/UI/organisms/option/action-card";
import { Container } from "@/components/UI/atoms/container";
import { useCoverInfo } from "@/src/hooks/useCoverInfo";
import { getCoverImgSrc, toBytes32 } from "@/src/helpers/cover";
import { classNames } from "@/utils/classnames";

export const CoverOptionsPage = () => {
  const router = useRouter();
  const { cover_id } = router.query;
  const coverKey = toBytes32(cover_id);
  const { coverInfo } = useCoverInfo(coverKey);

  if (!coverInfo) {
    return <>loading...</>;
  }

  const imgSrc = getCoverImgSrc(coverInfo);
  const title = coverInfo.coverName;
  return (
    <div className="md:px-2 lg:px-8 py-6 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-4">
        <CoverProfileInfoShort
          imgSrc={imgSrc}
          title={title}
          className="mb-7 lg:mb-28"
          fontSizeClass="text-h7 md:text-h4"
        />
      </div>
      <Container className="pb-16">
        <h2 className="text-h4 md:text-h3 lg:text-h2 font-sora font-bold mb-4 md:mb-6 lg:mb-12 text-center">
          I Want to
        </h2>
        <div className="container mx-auto justify-items-center grid grid-cols-2 gap-4 lg:gap-8 sm:grid-cols-2 lg:grid-cols-4 mb-6 md:mb-8 lg:mb-14">
          {Object.keys(coverActions).map((actionKey) => {
            return (
              <Link
                key={actionKey}
                href={coverActions[actionKey].getHref(cover_id)}
              >
                <a
                  className={classNames(
                    "rounded-2xl md:rounded-3xl group py-10 md:py-12 h-full w-full transition duration-300 ease-out",
                    "hover:border-B0C4DB hover:ease-in hover:border-0.5 hover:border-solid  hover:shadow-option  hover:box-border hover:rounded-3xl  hover:bg-white",
                    "focus:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-4e7dd9",
                    "border-B0C4DB border-0.5 box-border bg-white lg:bg-transparent lg:border-none"
                  )}
                >
                  <OptionActionCard
                    title={coverActions[actionKey].title}
                    description={coverActions[actionKey].description}
                    imgSrc={coverActions[actionKey].imgSrc}
                    smImgSrc={coverActions[actionKey].smImgSrc}
                    mdImgSrc={coverActions[actionKey].mdImgSrc}
                  />
                </a>
              </Link>
            );
          })}
        </div>
        <div className="text-center">
          <OutlinedButton
            className="rounded-big border-solid border-4E7DD9 border-1 pt-1 pb-1 pl-5 pr-4 md:py-3 md:pl-6 md:pr-5 "
            onClick={() => router.back()}
          >
            &#x27F5;&nbsp;Back
          </OutlinedButton>
        </div>
      </Container>
    </div>
  );
};
