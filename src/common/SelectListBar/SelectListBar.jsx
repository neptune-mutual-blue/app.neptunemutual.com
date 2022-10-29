import { useRouter } from 'next/router'
import { Select } from '@/common/Select'
import { t } from '@lingui/macro'
import { SORT_TYPES } from '@/utils/sorting'
import FilterIcon from '@/icons/FilterIcon'
import { homeViewSelectionKey } from '@/src/config/constants'
import { logCoverProductsViewChanged } from '@/src/services/logs'
import { useWeb3React } from '@web3-react/core'
import { analyticsLogger } from '@/utils/logger'

export const SelectListBar = ({
  sortClassContainer,
  sortClass,
  prefix,
  options = null
}) => {
  const { query, replace } = useRouter()
  const { account, chainId } = useWeb3React()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const defaultOptions = [
    { name: t`All`, value: SORT_TYPES.ALL },
    { name: t`Diversified Pool`, value: SORT_TYPES.DIVERSIFIED_POOL },
    { name: t`Dedicated Pool`, value: SORT_TYPES.DEDICATED_POOL }
  ]

  const selectOptions = options ?? defaultOptions

  const selectedOption = defaultOptions.find(
    (item) => item.value === query[homeViewSelectionKey]
  ) || defaultOptions[0]

  const handleSelectView = (_selected) => {
    replace(
      {
        query: {
          ...query,
          [homeViewSelectionKey]: _selected?.value
        }
      },
      undefined,
      {
        shallow: true
      }
    )
    analyticsLogger(() => logCoverProductsViewChanged(chainId ?? null, account ?? null, _selected?.value))
  }

  return (
    <div data-testid='select-list-bar' className={sortClassContainer}>
      <Select
        prefix={prefix}
        options={selectOptions}
        selected={selectedOption}
        setSelected={handleSelectView}
        className={sortClass}
        icon={<FilterIcon height={18} aria-hidden='true' />}
        direction='right'
      />
    </div>
  )
}
