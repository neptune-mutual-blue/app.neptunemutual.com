import {
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'

import { RegularButton } from '@/common/Button/RegularButton'
import { InputWithIcon } from '@/common/InputWithIcon/InputWithIcon'
import LeftArrow from '@/icons/LeftArrow'
import SearchIcon from '@/icons/SearchIcon'
import { getTokens } from '@/modules/swap/add-liquidity/TokenSelect/getTokens'
import {
  PopularTokens
} from '@/modules/swap/add-liquidity/TokenSelect/PopularTokens'
import { TokenItem } from '@/modules/swap/add-liquidity/TokenSelect/TokenItem'
import ImportToken from '@/modules/swap/common/ImportToken/ImportToken'
import { useNetwork } from '@/src/context/Network'
import { useERC20Details } from '@/src/hooks/useERC20Details'
import { useLocalStorage } from '@/src/hooks/useLocalStorage'
import { LocalStorage } from '@/utils/localstorage'
import {
  SORT_DATA_TYPES,
  sorter
} from '@/utils/sorting'
import { isAddress } from '@ethersproject/address'
import { useWeb3React } from '@web3-react/core'

export const TokenSelect = ({ show, toggleSelectToken, handleTokenSelect }) => {
  const [searchValue, setSearchValue] = useState('')
  const { networkId } = useNetwork()

  const { active } = useWeb3React()

  const [tokens, setTokens] = useState(null)

  const [customTokens, setCustomTokens] = useLocalStorage(LocalStorage.KEYS.CUSTOM_TOKEN_LIST, [])

  useEffect(() => {
    (async function () {
      const _tokens = await getTokens()
      if (_tokens) setTokens(_tokens)
    })()
  }, [])

  const sortedTokens = useMemo(() => {
    if (!networkId || !tokens) return []

    return sorter({
      list: networkId ? tokens[networkId] : tokens[1],
      selector: x => x.name,
      datatype: SORT_DATA_TYPES.STRING
    })
  }, [networkId, tokens])

  const filteredTokens = useMemo(() => {
    return sortedTokens.filter(token => {
      const _searchValue = searchValue.toLowerCase()
      const _tokenName = token.name.toLowerCase()
      const _tokenSymbol = token.symbol.toLowerCase()
      const _tokenAddress = token.address.toLowerCase()

      return _tokenName.includes(_searchValue) || _tokenSymbol.includes(_searchValue) || _tokenAddress.includes(_searchValue)
    })
  }, [sortedTokens, searchValue])

  const filteredCustomTokens = useMemo(() => {
    return customTokens.filter(token => {
      const _searchValue = searchValue.toLowerCase()
      const _tokenName = token.name.toLowerCase()
      const _tokenSymbol = token.symbol.toLowerCase()
      const _tokenAddress = token.address.toLowerCase()

      return _tokenName.includes(_searchValue) || _tokenSymbol.includes(_searchValue) || _tokenAddress.includes(_searchValue)
    })
  }, [customTokens, searchValue])

  useEffect(() => {
    setSearchValue('')
  }, [show])

  const [importTokenAddress, setImportTokenAddress] = useState('')

  useEffect(() => {
    if (!customTokens.find(token => token.address === searchValue) && !sortedTokens.find(token => token.address === searchValue) && isAddress(searchValue)) {
      setImportTokenAddress(searchValue)
    } else {
      setImportTokenAddress('')
    }
  }, [searchValue, sortedTokens, customTokens])

  const { name, symbol, decimals, loading } = useERC20Details(importTokenAddress)

  const [showImportToken, setShowImportToken] = useState(false)

  const manage = useRef(false)

  if (!show) return <></>

  const newToken = {
    name,
    address: importTokenAddress,
    symbol,
    decimals,
    logoSrc: ''
  }

  if (showImportToken) {
    return (
      <ImportToken
        initiallyManage={manage.current}
        hide={() => {
          setShowImportToken(false)
          setSearchValue('')
          manage.current = false
        }}
        token={newToken}
        setCustomTokens={setCustomTokens}
        customTokens={customTokens}
      />
    )
  }

  return (
    <div>
      <div className='flex justify-between'>
        <button
          className='flex items-center gap-2.5 text-xs font-semibold leading-6 rounded-2 tracking-2'
          onClick={toggleSelectToken}
        >
          <LeftArrow />
          <span className='text-xs leading-6 font-semibold'>
            BACK
          </span>
        </button>
        <h3 className='text-display-xs font-semibold'>Tokens</h3>
        <RegularButton
          onClick={() => {
            manage.current = true
            setShowImportToken(true)
          }} className='px-2 py-1 text-xs leading-6'
        >Manage
        </RegularButton>
      </div>

      <InputWithIcon
        className='mt-4'
        inputProps={{ type: 'text' }}
        Icon={<SearchIcon className='w-4 h-4' />}
        handleChange={val => setSearchValue(val)}
      />

      <PopularTokens tokens={tokens} className='mt-4' handleSelect={handleTokenSelect} />

      <hr className='h-1 my-4 text-B0C4DB' />

      {!importTokenAddress && filteredCustomTokens.length === 0 && filteredTokens.length === 0 && (
        <div className='text-center italic'>No Search Results!</div>
      )}

      <div className='overflow-y-auto h-400'>
        {importTokenAddress && (
          <div>
            {!active && <i>Please connect wallet to start importing tokens</i>}
            {loading && <i>Loading...</i>}
            {!loading && active && (
              <TokenItem
                token={newToken}
                handleSelect={handleTokenSelect}
                showImport
                onImport={() => {
                  setShowImportToken(true)
                }}
              />
            )}
          </div>
        )}
        {
          filteredCustomTokens
            .map((token, i) => (
              <TokenItem
                token={token}
                handleSelect={handleTokenSelect}
                key={i}
              />
            ))
        }
        {
          filteredTokens
            .map((token, i) => (
              <TokenItem
                token={token}
                handleSelect={handleTokenSelect}
                key={i}
              />
            ))
        }
      </div>
    </div>
  )
}
