import OpenInNewIcon from '@/icons/OpenInNewIcon'
import {
  TransactionHistory
} from '@/src/services/transactions/transaction-history'

export const ViewTxLink = ({ txLink, txHash = '' }) => {
  const handleLinkClick = () => {
    if (!txHash) { return }

    TransactionHistory.updateProperty(txHash, 'read', true)
  }

  return (
    <a
      className='flex'
      target='_blank'
      rel='noopener noreferrer nofollow'
      href={txLink}
      data-testid='view-tx-link'
      onClick={handleLinkClick}
    >
      <span className='inline-block'>View transaction</span>
      <OpenInNewIcon className='w-4 h-4 ml-2' fill='currentColor' />
    </a>
  )
}
