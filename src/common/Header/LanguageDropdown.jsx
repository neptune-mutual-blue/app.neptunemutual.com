import { useState, useEffect, Fragment } from "react";
import { useRouter } from "next/router";
import { Listbox, Transition } from "@headlessui/react";
import { languageKey, localesKey } from "@/src/config/constants";
import { classNames } from "@/utils/classnames";
import SelectedCircleIcon from "@/icons/SelectedCircleIcon";
import SearchLanguageIcon from "@/icons/SearchLanguageIcon";
import { useDebounce } from "@/src/hooks/useDebounce";
import { t } from "@lingui/macro";
import ChevronDownArrowIcon from "@/icons/ChevronDownArrowIcon";

const DEBOUNCE_TIMER = 200;

const LANGUAGES = Object.values(languageKey);

export const LanguageDropdown = () => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");

  const [languages, setLanguages] = useState(LANGUAGES);
  const debouncedSearch = useDebounce(searchValue, DEBOUNCE_TIMER);

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
    router.push(router.pathname, router.pathname, {
      locale: localesKey[value],
    });
  };

  const handleSearchLanguage = (e) => {
    setSearchValue(e.target.value);
  };

  return (
    <div className="relative h-6 my-1.5 cursor-pointer">
      <Listbox
        value={languageKey[router.locale]}
        onChange={handleOnChangeLanguage}
      >
        <Listbox.Button className="flex items-center text-sm outline-none">
          <div className="flex items-center text-xs text-white underline">
            <span className="mr-1.5">{languageKey[router.locale]?.split('-')[0]}</span>
            <ChevronDownArrowIcon aria-hidden="true" />
          </div>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-10 xl:right-0 py-[22px] px-4 mt-1 overflow-auto min-w-[274px] text-base bg-[#FEFEFF] border rounded-md shadow-lg xl:top-10 border-B0C4DB max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="flex items-center mb-3 text-sm">
              <SearchLanguageIcon width={16} height={16} className="mx-2.5" />
              <input
                className="w-full placeholder-[#B0C4DB] text-black outline-0 h-6 max-w-[250px]"
                placeholder={t`Search Language`}
                onChange={handleSearchLanguage}
              />
            </div>

            {languages.map((lang, i) => (
              <Listbox.Option key={i} value={lang} className="px-1">
                {({ selected, active }) => (
                  <span
                    className={classNames(
                      `truncate p-2 flex justify-between items-center text-xs font-medium`,
                      selected && "bg-[#b0c4db]   bg-opacity-20 rounded",
                      active
                        ? "text-4e7dd9 bg-[#b0c4db]  bg-opacity-20 rounded"
                        : "text-black"
                    )}
                  >
                    {lang} {selected && <SelectedCircleIcon className="pl-2" />}
                  </span>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </Listbox>
    </div>
  );
};
