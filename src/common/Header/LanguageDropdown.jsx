import { useState, useEffect, Fragment } from "react";
import { useRouter } from "next/router";
import { Listbox, Transition } from "@headlessui/react";
import {
  DEBOUNCE_TIMEOUT,
  languageKey,
  localesKey,
} from "@/src/config/constants";
import { classNames } from "@/utils/classnames";
import SelectedCircleIcon from "@/icons/SelectedCircleIcon";
import SearchLanguageIcon from "@/icons/SearchLanguageIcon";
import { useDebounce } from "@/src/hooks/useDebounce";
import { t } from "@lingui/macro";
import ChevronDownArrowIcon from "@/icons/ChevronDownArrowIcon";
import { getBrowserLocale } from "@/utils/locale";
import { useLocalStorage } from "@/src/hooks/useLocalStorage";
import GlobeLogo from "@/lib/connect-wallet/components/logos/Globe";

const LANGUAGES = Object.values(languageKey);
const LANGUAGE_KEYS = Object.keys(languageKey);

export const LanguageDropdown = () => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");

  const [language, setLanguage] = useLocalStorage("locale", null);

  useEffect(() => {
    const browserLocale = getBrowserLocale().replace(/-.*/, "");
    if (
      !language &&
      LANGUAGE_KEYS.includes(browserLocale) &&
      router.locale !== browserLocale
    ) {
      router.push(router.asPath, router.asPath, { locale: browserLocale });
      return;
    }

    if (LANGUAGE_KEYS.includes(language) && router.locale !== language) {
      router.push(router.asPath, router.asPath, { locale: language });
      return;
    }
  }, [language, router]);

  const [languages, setLanguages] = useState(LANGUAGES);
  const debouncedSearch = useDebounce(searchValue, DEBOUNCE_TIMEOUT);

  useEffect(() => {
    if (!debouncedSearch) {
      setLanguages(LANGUAGES);
      return;
    }
    const searchedLanguages = LANGUAGES.filter((el) =>
      el.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
    setLanguages(searchedLanguages);
  }, [debouncedSearch]);

  const handleOnChangeLanguage = (value) => {
    setLanguage(localesKey[value]);
    router.push(router.asPath, router.asPath, {
      locale: localesKey[value],
    });
  };

  const handleSearchLanguage = (e) => {
    setSearchValue(e.target.value);
  };

  return (
    <div className="relative mt-1.5 cursor-pointer flex items-center">
      <GlobeLogo className="mr-1.5" />
      <Listbox
        value={languageKey[router.locale]}
        onChange={handleOnChangeLanguage}
      >
        <Listbox.Button className="flex items-center text-sm outline-none">
          <div className="flex items-center text-xs text-white underline">
            <span className="mr-1.5">
              {languageKey[router.locale]?.split("-")[0]}
            </span>
            <ChevronDownArrowIcon aria-hidden="true" />
          </div>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="fixed z-50 top-8 right-8 xl:right-16 py-6 px-2 mt-1 overflow-auto min-w-[274px] text-base bg-[#FEFEFF] border rounded-md shadow-lg xl:top-10 border-B0C4DB ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="flex items-center pb-4 mb-1 text-sm">
              <SearchLanguageIcon width={16} height={16} className="mx-2.5" />
              <input
                className="w-full placeholder-[#B0C4DB] text-black outline-0 h-6 max-w-[250px] font-sora"
                placeholder={t`Search Language`}
                onChange={handleSearchLanguage}
              />
            </div>
            <div className="overflow-y-auto max-h-64">
              {languages.map((lang, i) => (
                <Listbox.Option key={i} value={lang}>
                  {({ selected, active }) => (
                    <span
                      className={classNames(
                        `truncate p-2 flex justify-between items-center text-xs font-medium tracking-normal font-sora leading-4`,
                        selected && "bg-[#b0c4db]   bg-opacity-20 rounded",
                        active
                          ? "text-4e7dd9 bg-[#b0c4db]  bg-opacity-20 rounded"
                          : "text-black"
                      )}
                    >
                      {lang}{" "}
                      {selected && (
                        <span aria-label="Selected">
                          <SelectedCircleIcon className="pl-2" />
                        </span>
                      )}
                    </span>
                  )}
                </Listbox.Option>
              ))}
            </div>
          </Listbox.Options>
        </Transition>
      </Listbox>
    </div>
  );
};
