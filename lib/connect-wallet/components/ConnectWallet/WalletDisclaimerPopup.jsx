import { OutlinedButton } from '@/common/Button/OutlinedButton'
import { RegularButton } from '@/common/Button/RegularButton'
import { Checkbox } from '@/common/Checkbox/Checkbox'
import { ModalWrapper } from '@/common/Modal/ModalWrapper'
import { Modal } from '@/lib/connect-wallet/components/Modal/Modal'
import useAuth from '@/lib/connect-wallet/hooks/useAuth'
import { useNetwork } from '@/src/context/Network'
import { useLocalStorage } from '@/src/hooks/useLocalStorage'
import * as Dialog from '@radix-ui/react-dialog'
import { useWeb3React } from '@web3-react/core'
import { useEffect, useMemo, useState } from 'react'
import { verifyMessage } from '@ethersproject/wallet'
import { getProviderOrSigner } from '@/lib/connect-wallet/utils/web3'

export const WalletDisclaimerPoup = () => {
  const [walletApprovals, setWalletApprovals] = useLocalStorage('wallet-disclaimer-approvals', [])
  const { account, library } = useWeb3React()

  const [agreements, setAgreements] = useState({})
  const acceptDisabled = useMemo(() => {
    return Boolean(Object.values(agreements).length !== 4 || Object.values(agreements).findIndex(e => !e) !== -1)
  }, [agreements])

  const approved = useMemo(() => {
    if (!walletApprovals || !account) return false

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
    setAgreements(_prev => ({ ..._prev, [name]: e.target.checked }))
  }

  return (
    <Modal isOpen={Boolean(!approved && account)} onClose={() => {}}>
      <ModalWrapper className='max-w-5xl transition-all bg-FEFEFF'>
        <Dialog.Title className='text-xl font-semibold leading-6 text-black'>
          Disclaimer
        </Dialog.Title>

        <div className='mt-5 text-sm leading-5 text-404040'>
          <p>By accessing or using Neptune Mutual App, I agree to the <a target='_blank' className='text-4e7dd9' href='https://neptunemutual.com/policies/terms-of-use' rel='noreferrer'>Terms of Service</a> and confirm that I have read and understood the <a target='_blank' className='text-4e7dd9' href='https://neptunemutual.com/policies/privacy-policy' rel='noreferrer'>Privacy Notice</a> and <a target='_blank' className='text-4e7dd9' href='https://neptunemutual.com/policies/risk-factors' rel='noreferrer'>Risk Factors</a>.</p>

          <p className='mt-2'>
            I hereby further represent and warrant that:
          </p>
        </div>

        <div className='flex flex-col mt-4 text-sm leading-5 gap-y-4 text-404040'>
          <div className='flex gap-1.5'>
            <Checkbox
              checked={agreements['not-resident-of-us'] ?? false}
              onChange={(e) => handleChecks('not-resident-of-us', e)}
              id='not-resident-of-us'
            >
              I'm not a resident of or located in the United States of America (including its territories: American Samoa, Guam, Puerto Rico, the Northern Mariana Islands and the U.S. Virgin Islands) or any other Restricted Jurisdiction (as defined in the Terms of Service).
            </Checkbox>
          </div>

          <div className='flex gap-1.5'>
            <Checkbox
              checked={agreements['not-prohibited-person'] ?? false}
              onChange={(e) => handleChecks('not-prohibited-person', e)}
              id='not-prohibited-person'
            >
              I'm not a Prohibited Person (as defined in the Terms of Service) nor acting on behalf of a Prohibited Person.
            </Checkbox>
          </div>

          <div className='flex gap-1.5'>
            <Checkbox
              checked={agreements['understand-the-technology'] ?? false}
              onChange={(e) => handleChecks('understand-the-technology', e)}
              id='understand-the-technology'
            >
              I fully understand the technology and financial risks associated with Neptune Mutual Protocol.
            </Checkbox>
          </div>

          <div className='flex gap-1.5'>
            <Checkbox
              checked={agreements['acknowledge-the-protocol'] ?? false}
              onChange={(e) => handleChecks('acknowledge-the-protocol', e)}
              id='acknowledge-the-protocol'
            >
              I acknowledge that Neptune Mutual Protocol, App, and related software are experimental, and that the use of experimental software may result in complete loss of my funds.
            </Checkbox>
          </div>
        </div>

        <hr className='h-px my-6 text-f6f7f9' />

        <div className='flex justify-end gap-4'>
          <OutlinedButton className='text-sm font-semibold leading-6 rounded-big' onClick={handleDisAgree}>Cancel</OutlinedButton>
          <RegularButton
            className='rounded-big py-2.5 px-4 text-sm leading-6 font-semibold'
            onClick={handleAgree}
            disabled={acceptDisabled}
          >Agree & Login
          </RegularButton>
        </div>

      </ModalWrapper>
    </Modal>
  )
}
