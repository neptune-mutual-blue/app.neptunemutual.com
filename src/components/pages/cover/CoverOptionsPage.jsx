import Link from "next/link";
import { useRouter } from "next/router";
import { actions as coverActions } from "@/src/config/cover/actions";
import { OutlinedButton } from "@/components/UI/atoms/button/outlined";
import { CoverProfileInfoShort } from "@/components/common/CoverProfileInfo/CoverProfileInfoShort";
import { OptionActionCard } from "@/components/UI/organisms/option/action-card";
import { Container } from "@/components/UI/atoms/container";
import { useCoverInfo } from "@/src/hooks/useCoverInfo";
import { getCoverImgSrc, toBytes32 } from "@/src/helpers/cover";

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
    <div
      className="px-8 py-6 min-h-screen"
      style={{
        backgroundImage: "url(/gradient.png)",
        backgroundSize: "cover",
        backgroundPosition: "left",
      }}
    >
      <CoverProfileInfoShort imgSrc={imgSrc} title={title} />
      <Container className="pb-16">
        <h2 className="text-h2 font-sora font-bold mb-12 text-center">
          I Want to
        </h2>
        <div className="container mx-auto justify-items-center grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 mt-14 mb-24">
          {Object.keys(coverActions).map((actionKey) => {
            return (
              <Link
                key={actionKey}
                href={coverActions[actionKey].getHref(cover_id)}
              >
                <a className="rounded-3xl py-12 h-full transition-all hover:bg-B0C4DB focus:bg-B0C4DB focus:outline-none focus-visible:ring-2 focus-visible:ring-4e7dd9">
                  <OptionActionCard
                    title={coverActions[actionKey].title}
                    description={coverActions[actionKey].description}
                    imgSrc={coverActions[actionKey].imgSrc}
                  />
                </a>
              </Link>
            );
          })}
        </div>
        <div className="text-center mt-10">
          <OutlinedButton className="rounded-big" onClick={() => router.back()}>
            &#x27F5;&nbsp;Back
          </OutlinedButton>
        </div>
      </Container>
    </div>
  );
};
