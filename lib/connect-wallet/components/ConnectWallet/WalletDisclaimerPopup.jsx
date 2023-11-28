import {
  useEffect,
  useMemo,
  useState
} from 'react'

import { OutlinedButton } from '@/common/Button/OutlinedButton'
import { RegularButton } from '@/common/Button/RegularButton'
import { Checkbox } from '@/common/Checkbox/Checkbox'
import { ModalWrapper } from '@/common/Modal/ModalWrapper'
import { Modal } from '@/lib/connect-wallet/components/Modal/Modal'
import { useAuth } from '@/lib/connect-wallet/hooks/useAuth'
import { getProviderOrSigner } from '@/lib/connect-wallet/utils/web3'
import { useNetwork } from '@/src/context/Network'
import { useLocalStorage } from '@/src/hooks/useLocalStorage'
import { verifyMessage } from '@ethersproject/wallet'
import * as Dialog from '@radix-ui/react-dialog'
import { useWeb3React } from '@web3-react/core'

const aggrements = [
  {
    text: 'I\'m not a resident of or located in the United States of America (including its territories: American Samoa, Guam, Puerto Rico, the Northern Mariana Islands and the U.S. Virgin Islands) or any other Restricted Jurisdiction (as defined in the Terms of Service).',
    id: 'not-resident-of-us'
  },
  {
    text: 'I\'m not a Prohibited Person (as defined in the Terms of Service) nor acting on behalf of a Prohibited Person.',
    id: 'not-prohibited-person'
  },
  {
    text: 'I fully understand the technology and financial risks associated with Neptune Mutual Protocol.',
    id: 'understand-the-technology'
  },
  {
    text: 'I acknowledge that Neptune Mutual Protocol, App, and related software are experimental, and that the use of experimental software may result in complete loss of my funds.',
    id: 'acknowledge-the-protocol'

  }
]

export const WalletDisclaimerPoup = () => {
  const [walletApprovals, setWalletApprovals] = useLocalStorage('wallet-disclaimer-approvals', [])
  const { account, library } = useWeb3React()

  const [agreements, setAgreements] = useState({})
  const acceptDisabled = useMemo(() => {
    return Boolean(Object.values(agreements).length !== 4 || Object.values(agreements).findIndex(e => { return !e }) !== -1)
  }, [agreements])

  const approved = useMemo(() => {
    if (!walletApprovals || !account) { return false }

    return Boolean(walletApprovals.includes(account))
  }, [walletApprovals, account])

  const { networkId } = useNetwork()
  const { logout } = useAuth(networkId)

  useEffect(() => {
    return () => {
      setAgreements({})
    }
  }, [])

  const handleAgree = async () => {
    try {
      const message = `
By accessing or using Neptune Mutual App, I agree to the Terms of Service and confirm that I have read and understood the Privacy Notice and Risk Factors.

I hereby further represent and warrant that:

- I'm not a resident of or located in the United States of America (including its territories: American Samoa, Guam, Puerto Rico, the Northern Mariana Islands and the U.S. Virgin Islands) or any other Restricted Jurisdiction (as defined in the Terms of Service).

- I'm not a Prohibited Person (as defined in the Terms of Service) nor acting on behalf of a Prohibited Person.

- I fully understand the technology and financial risks associated with Neptune Mutual Protocol.

- I acknowledge that Neptune Mutual Protocol, App, and related software are experimental, and that the use of experimental software may result in complete loss of my funds.`

      const signerOrProvider = getProviderOrSigner(library, account, networkId)
      const signedData = await signerOrProvider?.signMessage(message)

      const verified = verifyMessage(message, signedData)

      if (verified === account) {
        setWalletApprovals([...walletApprovals, account])
      }
    } catch (err) {
      console.error(err)
      logout()
    }
  }

  const handleDisAgree = () => {
    logout()
  }

  const handleChecks = (name, e) => {
    setAgreements(_prev => { return { ..._prev, [name]: e.target.checked } })
  }

  return (
    <Modal isOpen={Boolean(!approved && account)} onClose={() => {}}>
      <ModalWrapper className='max-w-5xl transition-all bg-FEFEFF'>
        <Dialog.Title className='text-xl font-semibold leading-6 text-black'>
          Disclaimer
        </Dialog.Title>

        <div className='mt-5 text-sm leading-5 text-404040'>
          <p>By accessing or using Neptune Mutual App, I agree to the <a target='_blank' className='text-4E7DD9' href='https://neptunemutual.com/policies/terms-of-use' rel='noreferrer'>Terms of Service</a> and confirm that I have read and understood the <a target='_blank' className='text-4E7DD9' href='https://neptunemutual.com/policies/privacy-policy' rel='noreferrer'>Privacy Notice</a> and <a target='_blank' className='text-4E7DD9' href='https://neptunemutual.com/policies/risk-factors' rel='noreferrer'>Risk Factors</a>.</p>

          <p className='mt-2'>
            I hereby further represent and warrant that:
          </p>
        </div>

        <div className='flex flex-col mt-4 text-sm leading-5 gap-y-4 text-404040'>
          {
            aggrements.map(({ id, text }, idx) => {
              return (
                <div className='flex gap-1.5' key={idx}>
                  <Checkbox
                    checked={agreements[id] ?? false}
                    onChange={(e) => { return handleChecks(id, e) }}
                    id={id}
                  >
                    {text}
                  </Checkbox>
                </div>
              )
            })
          }
        </div>

        <hr className='h-px my-6 text-F6F7F9' />

        <div className='flex flex-wrap-reverse justify-end gap-4'>
          <OutlinedButton className='w-full text-sm font-semibold leading-6 sm:w-auto rounded-big' onClick={handleDisAgree}>Cancel</OutlinedButton>
          <RegularButton
            className='w-full sm:w-auto rounded-big py-2.5 px-4 text-sm leading-6 font-semibold'
            onClick={handleAgree}
            disabled={acceptDisabled}
          >Agree & Login
          </RegularButton>
        </div>

      </ModalWrapper>
    </Modal>
  )
}
