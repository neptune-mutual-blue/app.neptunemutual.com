import { utils } from '@neptunemutual/sdk'
import { useEffect, useState } from 'react'
import { Trans } from '@lingui/macro'

export const ReportingInfo = ({ ipfsHash }) => {
  const [data, setData] = useState(null)

  useEffect(() => {
    let ignore = false
    utils.ipfs
      .read(ipfsHash)
      .then((x) => {
        if (ignore) { return }
        setData(x)
      })
      .catch(console.error)

    return () => {
      ignore = true
    }
  }, [ipfsHash])

  return (
    <details open>
      <summary>
        <Trans>Reporting Info</Trans>
      </summary>
      <pre
        className='p-4 overflow-x-auto bg-white rounded-md'
        data-testid='reporter-info-ipfs-data'
      >
        {JSON.stringify(data, null, 2)}
      </pre>
    </details>
  )
}
