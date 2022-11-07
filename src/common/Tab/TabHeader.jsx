import { Tab } from '@/common/Tab/Tab'
import { log } from '@/src/services/logs'
import { classNames } from '@/utils/classnames'
import { useWeb3React } from '@web3-react/core'

export const TabHeader = ({ activeTab, headers, onClick }) => {
  const { chainId, account } = useWeb3React()
  return (
    <div
      className='px-2 border-b border-b-B0C4DB xs:px-16 sm:min-w-fit'
      data-testid='tab-header-container'
    >
      <div className='flex justify-center mx-auto xs:max-w-7xl xs:justify-start '>
        {headers.map((header) => (
          <Tab key={header.name} active={activeTab === header.name}>
            <button
              onClick={() => {
                log(chainId, 'Withdraw Reward', 'stake-page', 'withdraw-tab-button', 3, account, 'click')

                onClick(header.name)
              }}
              className={classNames(
                'inline-block px-6 py-2',
                activeTab === header.name ? 'font-semibold' : ''
              )}
              data-testid='tab-btn'
            >
              {header.displayAs}
            </button>
          </Tab>
        ))}
      </div>
    </div>
  )
}
