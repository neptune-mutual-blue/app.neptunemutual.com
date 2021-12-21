import Link from "next/link";
import { useRouter } from "next/router";
import { actions as coverActions } from "@/src/config/cover/actions";
import { useCoverInfo } from "@/components/pages/options/useCoverInfo";
import { OutlinedButton } from "@/components/UI/atoms/button/outlined";
import { CoverOptionName } from "@/components/UI/molecules/cover/option/option-name";
import { OptionActionCard } from "@/components/UI/organisms/option/action-card";
import { Container } from "@/components/UI/atoms/container";

export const OptionsPage = () => {
  const router = useRouter();
  const { coverInfo } = useCoverInfo();

  if (!coverInfo) {
    return <>loading...</>;
  }

  const imgSrc = "/covers/clearpool.png";
  const title = coverInfo.name;

  return (
    <div>
      <main className="bg-gray-bg">
        <div
          className="px-8 py-6 h-screen"
          style={{
            backgroundImage: "url(/gradient.png)",
            backgroundSize: "cover",
            backgroundPosition: "left",
          }}
        >
          <CoverOptionName imgSrc={imgSrc} title={title} />
          <Container>
            <h2 className="text-h2 font-sora font-bold mb-12 text-center">
              {`I Want to`}
            </h2>
            <div
              className={
                "container mx-auto justify-items-center grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 mt-14 mb-24"
              }
            >
              {Object.keys(coverActions).map((actionKey) => {
                return (
                  <Link key={actionKey} href={coverActions[actionKey].href}>
                    <a className="rounded-4xl focus:ring-2 focus:ring-offset-2 focus:ring-black focus:outline-none py-12 h-full hover:bg-B0C4DB focus:bg-B0C4DB">
                      <OptionActionCard
                        title={coverActions[actionKey].title}
                        description={coverActions[actionKey].description}
                        imgSrc={`/options/${actionKey}.png`}
                      />
                    </a>
                  </Link>
                );
              })}
            </div>
            <div className="text-center mt-10">
              <OutlinedButton onClick={() => router.back()}>
                &#x27F5;&nbsp;Back
              </OutlinedButton>
            </div>
          </Container>
        </div>
      </main>
    </div>
  );
};
