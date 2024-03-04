import {
  useEffect,
  useState
} from 'react'

import { useRouter } from 'next/router'

import { ModalRegular } from '@/common/Modal/ModalRegular'
import { convertToIconVariant } from '@/common/TransactionList/helpers'
import CheckIcon from '@/icons/CheckIcon'
import { getTxLink } from '@/lib/connect-wallet/utils/explorer'
import { useToast } from '@/lib/toast/context'
import { Routes } from '@/src/config/routes'
import { useNetwork } from '@/src/context/Network'
import { useActionMessage } from '@/src/helpers/notification'
import { LSHistory } from '@/src/services/transactions/history'
import {
  TransactionHistory
} from '@/src/services/transactions/transaction-history'
import { classNames } from '@/utils/classnames'
import { fromNow } from '@/utils/formatter/relative-time'
import { Trans } from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'

export function TransactionList ({
  isOpen = false,
  onClose,
  container
}) {
  const toast = useToast()
  const [activeTab, setActiveTab] = useState('all')
  const { account } = useWeb3React()
  const { networkId } = useNetwork()

  const [
    /**
     * @type {import('@/src/services/transactions/history').IHistoryEntry[]}
     */
    listOfTransactions,
    /**
     * @type {(state: import('@/src/services/transactions/history').IHistoryEntry[]) => void}
     */
    setListOfTransactions
  ] = useState([])
  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)

  useEffect(() => {
    toast.hide(isOpen)

    if (!account) {
      setListOfTransactions([])

      return
    }

    if (isOpen) {
      const history = activeTab === 'unread'
        ? LSHistory.getUnread(page)
        : LSHistory.get(page)

      setListOfTransactions(() => {
        return [...history.data]
      })
      setMaxPage(history.maxPage)

      const updateListener = TransactionHistory.on(() => {
        const history = activeTab === 'unread'
          ? LSHistory.getUnread(page)
          : LSHistory.get(page)

        setListOfTransactions(() => {
          return [...history.data]
        })
      })

      return () => {
        updateListener.off()
      }
    }

    setListOfTransactions([])
    setPage(1)
    setMaxPage(1)
  }, [isOpen, page, activeTab, account, toast])

  const handleTabChange = tab => {
    setActiveTab(tab || 'all')
  }

  const handleMarkAllAsRead = () => {
    TransactionHistory.markAllAsRead()
  }

  return (
    <ModalRegular
      isOpen={isOpen}
      onClose={onClose}
      rootProps={{ modal: true, onOpenChange: onClose }}
      overlayClass='flex justify-end w-full h-full bg-transparent'
      defaultContentClassNames='w-screen md:w-auto fixed right-0 top-14 md:absolute z-50 transform md:top-full md:-right-10 xl:right-5 px-0 pt-0 md:pt-3 md:rounded-3xl'
      container={container}
      noBlur
      data-testid='transaction-modal'
    >
      <div className='relative flex flex-col min-h-screen px-6 pb-4 overflow-hidden md:pl-4 md:min-h-0 bg-3A4557 text-FEFEFF md:rounded-3xl shadow-tx-list md:min-w-416'>
        <p className='mt-6 font-bold text-md'>Transactions</p>

        <div className='flex gap-2 mt-4 md:pr-4'>
          <button
            onClick={() => { return handleTabChange('all') }}
            className={classNames('rounded-2xl text-sm leading-5 py-0.5 px-4 text-white',
              activeTab === 'all' && 'bg-364253'
            )}
          >
            All
          </button>
          <button
            onClick={() => { return handleTabChange('unread') }}
            className={classNames('rounded-2xl text-sm leading-5 py-0.5 px-4 text-white',
              activeTab === 'unread' && 'bg-364253'
            )}
          >
            Unread
          </button>
          <button
            className='flex items-center gap-2 text-xs leading-4.5 ml-auto'
            onClick={handleMarkAllAsRead}
          >
            <CheckIcon />
            <span>Mark all as read</span>
          </button>
        </div>

        <div className='pr-4 mt-4 overflow-y-auto md:min-h-0 max-h-tx-list-mobile md:max-h-tx-list'>
          <NotificationsList data={listOfTransactions} activeTab={activeTab} networkId={networkId} />
        </div>
        <div className={`grow text-center pt-10 md:pt-6 -ml-8 md:ml-0 ${page >= maxPage ? 'hidden' : ''}`}>
          <a href={Routes.TransactionHistory(networkId)} className='text-sm underline hover:no-underline'>
            <Trans>View More</Trans>
          </a>
        </div>
      </div>
    </ModalRegular>
  )
}

/**
 *
 * @param {{
 *  data: import('@/src/services/transactions/history').IHistoryEntry[],
 *  activeTab: string,
 *  networkId: number
 * }} prop
 * @returns
 */
function NotificationsList ({ data, activeTab, networkId }) {
  const { locale } = useRouter()

  if (data.length) {
    return (
      <div className='md:w-96'>
        {data.map((transaction) => {
          return (
            <Notification
              {...transaction}
              networkId={networkId}
              locale={locale}
              key={transaction.hash}
              read={transaction.read}
            />
          )
        })}
      </div>
    )
  }

  return (
    <div className='block p-4 text-center whitespace-nowrap'>
      {
        activeTab === 'unread'
          ? <Trans>No unread notifications</Trans>
          : <Trans>No transaction history to show</Trans>
        }
    </div>
  )
}

/**
 * @param {import('@/src/services/transactions/history').IHistoryEntry & { networkId: number, locale: string }} prop
 */
function Notification ({
  hash,
  methodName,
  timestamp,
  status,
  data,
  networkId,
  locale,
  read = false
}) {
  const txLink = getTxLink(networkId, { hash })

  const { getActionMessage } = useActionMessage()

  const { title, description } = getActionMessage(
    methodName,
    status,
    data,
    locale
  )

  const handleLinkClick = () => {
    if (!hash) { return }
    TransactionHistory.updateProperty(hash, 'read', true)
  }

  return (
    <div
      className='relative flex p-2 rounded-lg border-B0C4DB hover:bg-5E6C83'
      key={hash}
      data-testid='notification-item'
    >
      <div className='mr-4'>{convertToIconVariant(status)}</div>
      <div className='mr-4 grow'>
        <p className='mb-1 text-sm font-bold'>{title}</p>
        <p className='text-sm'>{description}</p>
        <p className='mt-2 text-xs leading-4 tracking-normal text-999BAB'>
          {fromNow(timestamp / 1000)}
        </p>
      </div>
      <a
        className='flex items-center self-end text-xs whitespace-nowrap text-4289F2'
        href={txLink}
        target='_blank'
        rel='noreferrer'
        onClick={handleLinkClick}
      >
        <Trans>View Tx</Trans> &gt;
      </a>

      {!read && (
        <i className='absolute rounded-full w-9px h-9px bg-4E7DD9 top-2 right-2' />
      )}
    </div>
  )
}
