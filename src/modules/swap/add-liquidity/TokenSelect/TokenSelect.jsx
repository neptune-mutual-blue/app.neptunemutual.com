import { RegularButton } from '@/common/Button/RegularButton'
import { InputWithIcon } from '@/common/InputWithIcon/InputWithIcon'
import LeftArrow from '@/icons/LeftArrow'
import SearchIcon from '@/icons/SearchIcon'
import { PopularTokens } from '@/modules/swap/add-liquidity/TokenSelect/PopularTokens'
import { TokenItem } from '@/modules/swap/add-liquidity/TokenSelect/TokenItem'
import { getTokens } from '@/modules/swap/add-liquidity/TokenSelect/getTokens'
import { useNetwork } from '@/src/context/Network'
import { SORT_DATA_TYPES, sorter } from '@/utils/sorting'
import { useEffect, useMemo, useState } from 'react'

export const TokenSelect = ({ show, toggleSelectToken, handleTokenSelect }) => {
  const [searchValue, setSearchValue] = useState('')
  const { networkId } = useNetwork()

  const [tokens, setTokens] = useState(null)

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
      return _tokenName.includes(_searchValue) || _tokenSymbol.includes(_searchValue)
    })
  }, [sortedTokens, searchValue])

  useEffect(() => {
    setSearchValue('')
  }, [show])

  if (!show) return <></>

  return (
    <div>
      <div className='flex justify-between'>
        <button
          className='flex items-center gap-1 text-xs font-semibold leading-6 rounded-2 tracking-2'
          onClick={toggleSelectToken}
        >
          <LeftArrow />
          Back
        </button>
        <h3 className='text-display-xs'>Tokens</h3>
        <RegularButton className='px-2 py-1 text-xs leading-6'>Manage</RegularButton>
      </div>

      <InputWithIcon
        className='mt-4'
        inputProps={{ type: 'text' }}
        Icon={<SearchIcon className='w-4 h-4' />}
        handleChange={val => setSearchValue(val)}
      />

      <PopularTokens tokens={tokens} className='mt-4' handleSelect={handleTokenSelect} />

      <hr className='h-1 my-4 text-B0C4DB' />

      <div className='overflow-y-auto h-400'>
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
