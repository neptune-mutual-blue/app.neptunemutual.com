import { ModalRegular } from '@/common/Modal/ModalRegular'
import { t } from '@lingui/macro'
import { useEffect, useState } from 'react'
import { LSHistory } from '@/src/services/transactions/history'
import { convertToIconVariant } from '@/common/TransactionList/helpers'
import { getActionMessage } from '@/src/helpers/notification'
import { getTxLink } from '@/lib/connect-wallet/utils/explorer'
import { useNetwork } from '@/src/context/Network'
import { fromNow } from '@/utils/formatter/relative-time'
import { useRouter } from 'next/router'
import { useToast } from '@/lib/toast/context'
import { TransactionHistory } from '@/src/services/transactions/transaction-history'
import { Routes } from '@/src/config/routes'

export function TransactionList ({
  isOpen = false,
  onClose,
  container
}) {
  const toast = useToast()

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
    if (isOpen) {
      const history = LSHistory.get(page)
      setListOfTransactions((current) => {
        const hashes = current.map(({ hash }) => hash)

        return [
          ...current,
          ...history.data.filter((item) => !hashes.includes(item.hash))
        ]
      })
      setMaxPage(history.maxPage)

      const updateListener = TransactionHistory.on((item) => {
        setListOfTransactions((items) =>
          items.map((_item) => {
            if (_item.hash === item.hash) {
              Object.assign(_item, item)
            }

            return _item
          })
        )
      })

      return () => {
        updateListener.off()
      }
    }

    setListOfTransactions([])
    setPage(1)
    setMaxPage(1)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, page])

  return (
    <ModalRegular
      isOpen={isOpen}
      onClose={onClose}
      rootProps={{ modal: true, onOpenChange: onClose }}
      overlayClass='flex justify-end w-full h-full bg-transparent'
      defaultContentClassNames='w-screen md:w-auto absolute z-50 transform top-full -right-13 md:-right-10 xl:right-5 px-0 pt-0 md:pt-3 md:rounded-3xl'
      container={container}
      noBlur
    >
      <div className='flex flex-col min-h-screen md:min-h-0 relative pl-4 overflow-hidden font-poppins bg-3A4557 text-FEFEFF md:rounded-3xl shadow-tx-list'>
        <div className='pr-4 overflow-y-auto md:min-h-0 max-h-tx-list-mobile md:max-h-tx-list'>
          <NotificationsList data={listOfTransactions} />
        </div>
        <div className={`grow text-center pt-10 md:pt-4 md:pb-4 ${page >= maxPage ? 'hidden' : ''}`}>
          <a href={Routes.TransactionHistory} className='text-sm underline hover:no-underline'>
            {t`View More`}
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
 * }} prop
 * @returns
 */
function NotificationsList ({ data }) {
  const { networkId } = useNetwork()
  const { locale } = useRouter()

  if (data.length) {
    return (
      <div className='pt-2 md:w-96'>
        {data.map((transaction) => (
          <Notification
            {...transaction}
            networkId={networkId}
            locale={locale}
            key={transaction.hash}
          />
        ))}
      </div>
    )
  }

  return (
    <div className='block p-4 whitespace-nowrap text-center'>{t`No transaction history to show`}</div>
  )
}

/**
 * @param {import('@/src/services/transactions/history').IHistoryEntry & { networkId: string, locale: string }} prop
 */
function Notification ({
  hash,
  methodName,
  timestamp,
  status,
  data,
  networkId,
  locale
}) {
  const txLink = getTxLink(networkId, { hash })

  const { title, description } = getActionMessage(
    methodName,
    status,
    data,
    locale
  )

  return (
    <div
      className='flex py-4 border-b border-B0C4DB'
      key={hash}
      data-testid='notification-item'
    >
      <div className='mr-4'>{convertToIconVariant(status)}</div>
      <div className='mr-4 grow'>
        <p className='mb-1 text-sm font-bold font-sora'>{title}</p>
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
      >
        {t`View Tx`} &gt;
      </a>
    </div>
  )
}
