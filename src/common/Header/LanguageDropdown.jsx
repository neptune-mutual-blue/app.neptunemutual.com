import {
  Fragment,
  useEffect,
  useState
} from 'react'

import ChevronDownArrowIcon from '@/icons/ChevronDownArrowIcon'
import SearchLanguageIcon from '@/icons/SearchLanguageIcon'
import SelectedCircleIcon from '@/icons/SelectedCircleIcon'
import GlobeLogo from '@/lib/connect-wallet/components/logos/Globe'
import { DEBOUNCE_TIMEOUT } from '@/src/config/constants'
import {
  languageKey,
  localesKey
} from '@/src/config/locales'
import { useDebounce } from '@/src/hooks/useDebounce'
import { parseLocale } from '@/src/i18n/utils'
import { classNames } from '@/utils/classnames'
import {
  Listbox,
  Transition
} from '@headlessui/react'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { useLanguageContext } from '@/src/i18n/i18n'

const LANGUAGES = Object.values(languageKey)

/**
 * @param {object} props
 * @param {boolean?} [props.onOverlay]
 * @returns
 */
export const LanguageDropdown = (props) => {
  const { i18n } = useLingui()

  const [searchValue, setSearchValue] = useState('')

  const { locale, setLocale } = useLanguageContext()

  const [languagesToShow, setLanguagesToShow] = useState(LANGUAGES)
  const debouncedSearch = useDebounce(searchValue, DEBOUNCE_TIMEOUT)

  useEffect(() => {
    if (!debouncedSearch) {
      setLanguagesToShow(LANGUAGES)

      return
    }
    const searchedLanguages = LANGUAGES.filter((el) => { return el.toLowerCase().includes(debouncedSearch.toLowerCase()) }
    )
    setLanguagesToShow(searchedLanguages)
  }, [debouncedSearch])

  const handleOnChangeLanguage = (value) => {
    setLocale(parseLocale(localesKey[value]))
  }

  const handleSearchLanguage = (e) => {
    setSearchValue(e.target.value)
  }

  return (
    <div className='relative flex items-center mt-3 cursor-pointer'>
      <Listbox
        value={languageKey[locale]}
        onChange={handleOnChangeLanguage}
      >
        {
          ({ open }) => {
            return (
              <>
                <Listbox.Button className={classNames(
                  'flex items-center text-sm outline-none hover:underline focus-visible:underline',
                  open && 'underline'
                )}
                >
                  <div className='flex items-center gap-1 text-xs text-white'>
                    <GlobeLogo />
                    <span>
                      {languageKey[locale]?.split('-')[0]}
                    </span>
                    <ChevronDownArrowIcon aria-hidden='true' />
                  </div>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave='transition ease-in duration-100'
                  leaveFrom='opacity-100'
                  leaveTo='opacity-0'
                >
                  <Listbox.Options className={classNames(
                    'z-50 py-6 px-2 mt-4 absolute h-fit top-4 right-0 overflow-auto min-w-[260px] sm:min-w-[274px] text-base bg-[#FEFEFF] border rounded-md shadow-lg border-B0C4DB ring-1 ring-black ring-opacity-5 focus:outline-none',
                    props.onOverlay && 'left-0 w-fit'
                  )}
                  >
                    <div className='flex items-center pb-4 mb-1 text-sm'>
                      <SearchLanguageIcon width={16} height={16} className='mx-2.5' />
                      <input
                        autoComplete='off'
                        className='w-full placeholder-[#B0C4DB] text-black outline-0 h-6 max-w-[250px]'
                        placeholder={t(i18n)`Search Language`}
                        onChange={handleSearchLanguage}
                      />
                    </div>
                    <div className='overflow-y-auto max-h-64'>
                      {languagesToShow.map((lang, i) => {
                        return (
                          <Listbox.Option key={i} value={lang}>
                            {({ selected, active }) => {
                              return (
                                <span
                                  className={classNames(
                                    'truncate p-2 flex justify-between items-center text-xs font-medium tracking-normal leading-4',
                                    selected && 'bg-[#b0c4db]   bg-opacity-20 rounded',
                                    active
                                      ? 'text-4E7DD9 bg-[#b0c4db]  bg-opacity-20 rounded'
                                      : 'text-black'
                                  )}
                                >
                                  {lang}{' '}
                                  {selected && (
                                    <span aria-label='Selected'>
                                      <SelectedCircleIcon className='pl-2' />
                                    </span>
                                  )}
                                </span>
                              )
                            }}
                          </Listbox.Option>
                        )
                      })}
                    </div>
                  </Listbox.Options>
                </Transition>
              </>
            )
          }
        }
      </Listbox>
    </div>
  )
}
