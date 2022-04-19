import Head from "next/head";
import { useRouter } from "next/router";

import { Container } from "@/common/Container/Container";
import { Hero } from "@/common/Hero";
import { languageKey, localesKey } from "@/src/config/constants";
import { Trans } from "@lingui/macro";

export default function Settings() {
  const router = useRouter();

  const languages = Object.values(languageKey);

  function handleOnChangeLanguage(e) {
    const lang = e.target.value;

    router.push(router.pathname, router.pathname, {
      locale: localesKey[lang],
    });
  }

  return (
    <main>
      <Head>
        <title>Neptune Mutual Covers</title>
        <meta
          name="description"
          content="Get guaranteed payouts from our parametric cover model. Resolve incidents faster without the need for claims assessment."
        />
      </Head>
      <Hero>
        <Container className="px-2 py-20">
          <h1 className="mb-4">
            <Trans>Settings</Trans>
          </h1>
          <select
            name="language"
            onChange={handleOnChangeLanguage}
            defaultValue={languageKey[router.locale]}
          >
            {languages.map((lang, i) => (
              <option key={i} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </Container>
      </Hero>
    </main>
  );
}
