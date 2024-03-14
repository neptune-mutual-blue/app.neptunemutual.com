import {
  Fragment,
  useEffect,
  useState
} from 'react'

import { useRouter } from 'next/router'

import LeftArrow from '@/icons/LeftArrow'
import SearchLanguageIcon from '@/icons/SearchLanguageIcon'
import SelectedCircleIcon from '@/icons/SelectedCircleIcon'
import GlobeLogo from '@/lib/connect-wallet/components/logos/Globe'
import { DEBOUNCE_TIMEOUT } from '@/src/config/constants'
import {
  languageKey,
  localesKey
} from '@/src/config/locales'
import { useDebounce } from '@/src/hooks/useDebounce'
import { useLocalStorage } from '@/src/hooks/useLocalStorage'
import { useWindowSize } from '@/src/hooks/useWindowSize'
import { classNames } from '@/utils/classnames'
import { getBrowserLocale } from '@/utils/locale'
import {
  Listbox,
  Transition
} from '@headlessui/react'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import {
  Content,
  Overlay,
  Portal,
  Root
} from '@radix-ui/react-dialog'

const LANGUAGES = Object.values(languageKey)
const LANGUAGE_KEYS = Object.keys(languageKey)

/**
 * @param {object} props
 * @param {boolean?} [props.onOverlay]
 * @returns
 */
export const LanguageDropdown = (props) => {
  const router = useRouter()
  const [searchValue, setSearchValue] = useState('')

  const [language, setLanguage] = useLocalStorage('locale', null)

  const { width } = useWindowSize()

  useEffect(() => {
    const browserLocale = getBrowserLocale().replace(/-.*/, '')
    if (
      !language &&
      LANGUAGE_KEYS.includes(browserLocale) &&
      router.locale !== browserLocale
    ) {
      router.push(router.asPath, router.asPath, { locale: browserLocale })

      return
    }

    if (LANGUAGE_KEYS.includes(language) && router.locale !== language) {
      router.push(router.asPath, router.asPath, { locale: language })
    }
  }, [language, router])

  const [languages, setLanguages] = useState(LANGUAGES)
  const debouncedSearch = useDebounce(searchValue, DEBOUNCE_TIMEOUT)

  useEffect(() => {
    if (!debouncedSearch) {
      setLanguages(LANGUAGES)

      return
    }
    const searchedLanguages = LANGUAGES.filter((el) => { return el.toLowerCase().includes(debouncedSearch.toLowerCase()) }
    )
    setLanguages(searchedLanguages)
  }, [debouncedSearch])

  const handleOnChangeLanguage = (value) => {
    setLanguage(localesKey[value])
    router.push(router.asPath, router.asPath, {
      locale: localesKey[value]
    })
  }

  const handleSearchLanguage = (e) => {
    setSearchValue(e.target.value)
  }

  const { i18n } = useLingui()

  return (
    <div className='relative flex items-center mt-1 cursor-pointer md:mt-3'>
      <Listbox
        value={languageKey[router.locale]}
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
                  <div className={classNames('flex items-center gap-1 text-current text-md font-medium')}>
                    <GlobeLogo className='w-6 h-6 text-current' />
                    <span>
                      {languageKey[router.locale]?.split('-')[0]}
                    </span>
                  </div>
                </Listbox.Button>

                <Transition
                  show={open && width > 768}
                  as={Fragment}
                  leave='transition ease-in duration-100'
                  leaveFrom='opacity-100'
                  leaveTo='opacity-0'
                >
                  <Listbox.Options className={classNames(
                    'z-50 p-4 bg-[#FEFEFF] absolute rounded-2 border border-B0C4DB shadow-menu min-w-300 flex flex-col gap-4 bottom-full-plus-16',
                    props.onOverlay && 'left-0 w-fit'
                  )}
                  >
                    <div className='flex items-center justify-between gap-1 py-2.5 px-4 border rounded-2 border-B0C4DB'>
                      <input
                        autoComplete='off'
                        className='w-full placeholder-[#B0C4DB] text-black outline-none text-sm'
                        placeholder={t(i18n)`Search Language`}
                        value={searchValue}
                        onChange={handleSearchLanguage}
                      />

                      <SearchLanguageIcon width={16} height={16} />
                    </div>
                    <div className='flex flex-col gap-3 overflow-y-auto max-h-400'>
                      {languages.map((lang, i) => {
                        return (
                          <Listbox.Option key={i} value={lang}>
                            {({ selected, active }) => {
                              return (
                                <span
                                  className={classNames(
                                    'truncate flex justify-between items-center text-xs tracking-normal leading-4',
                                    active
                                      ? 'text-4E7DD9'
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

                <MobileLanguageDropdown
                  open={open && width <= 768}
                  languages={languages}
                  searchValue={searchValue}
                  handleSearchLanguage={handleSearchLanguage}
                  i18n={i18n}
                  currentLanguage={languageKey[router.locale]}
                />
              </>
            )
          }
        }
      </Listbox>
    </div>
  )
}

const MobileLanguageDropdown = ({ open, languages, searchValue, handleSearchLanguage, i18n, currentLanguage }) => {
  return (
    <Root open={open}>
      <Portal className='md:hidden'>
        <Overlay className='fixed inset-0 z-50 bg-black bg-opacity-80 backdrop-blur-md' />

        <Content className='fixed inset-0 w-full max-h-screen z-60'>
          <Listbox.Options className='flex flex-col h-full gap-2 cursor-pointer'>
            <div className='px-8 py-3'>
              <Listbox.Option
                value={currentLanguage}
                className='py-1 flex gap-2.5 items-center text-white text-md leading-5 uppercase'
              >
                <LeftArrow />
                <span>Back</span>
              </Listbox.Option>
            </div>

            <div className='flex-1 py-2.5 px-8 flex flex-col gap-6'>
              <div className='flex items-center py-2.5 px-4 bg-white rounded-2 gap-1'>
                <input
                  autoComplete='off'
                  className='w-full placeholder-[#B0C4DB] text-black outline-0 text-sm flex-1'
                  placeholder={t(i18n)`Search Language`}
                  value={searchValue}
                  onChange={handleSearchLanguage}
                />
                <SearchLanguageIcon width={16} height={16} className='text-black' />
              </div>

              <div className='flex flex-col flex-1 max-h-full gap-4 overflow-y-auto'>
                {languages.map((lang, i) => {
                  return (
                    <Listbox.Option
                      key={i} value={lang} className={
                      ({ selected }) => {
                        return classNames(
                          'truncate p-2 flex justify-between items-center text-lg tracking-normal leading-4 gap-2 cursor-pointer',
                          selected ? 'text-white' : 'text-9B9B9B'
                        )
                      }
                    }
                    >

                      {({ selected }) => {
                        return (
                          <>
                            {lang}
                            {selected && (
                              <span aria-label='Selected' className='flex-shrink-0'>
                                <SelectedCircleIcon className='w-4 h-4' />
                              </span>
                            )}
                          </>
                        )
                      }}
                    </Listbox.Option>
                  )
                })}
              </div>
            </div>
          </Listbox.Options>
        </Content>
      </Portal>
    </Root>
  )
}
