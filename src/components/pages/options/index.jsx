import Link from "next/link";
import { useRouter } from "next/router";
import { actions as optionActions } from "@/src/config/options/actions";
import { useCoverInfo } from "@/components/pages/options/useCoverInfo";
import { OutlinedButton } from "@/components/UI/atoms/button/outlined";
import { CoverOptionName } from "@/components/UI/molecules/cover/option/option-name";
import { OptionActionCard } from "@/components/UI/organisms/option/action-card";

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
          <div>
            <h2 className="text-h2 font-sora font-bold mb-12 text-center">
              {`I Want to`}
            </h2>
            <div className={"container mx-auto justify-items-center grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-4 mt-14 mb-24"}>
              {Object
                .keys(optionActions)
                .map((actionKey, i) => {
                  const isLast = Object.keys(optionActions).length === i + 1

                  return (
                    <Link key={i} href={`/${actionKey}`}>
                      <a
                        className="w-[280px] h-[394px] rounded-4xl focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-black focus:outline-none"                        
                      >
                        <OptionActionCard
                          title={optionActions[actionKey].title}
                          description={optionActions[actionKey].description}
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
          </div>
        </div>
       
      </main>
    </div>
  );
};
