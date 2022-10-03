
const mockParameters = [
  {
    parameter: 'Cover Policy Conditions',
    type: 'condition',
    text: 'This cover is not a contract of insurance. Cover is provided on a parametric basis and the decision as to whether or not an incident is validated is determined by Neptune Mutual’s incident reporting and resolution process whereby the result is based on the number of NPM tokens or vouchers staked by the community in the resolution process; this incident reporting and validation process is community driven, but in exceptional circumstances can be overridden by the Neptune Mutual Association in order to protect against certain types of on-chain consensus attacks.',
    list: {
      type: 'unordered',
      items: [
        'This policy relates exclusively to the AAVE v2 protocol deployed on the Ethereum blockchain.',
        'To be eligible for a claim, all policyholders must hold at least 10 NPM tokens in the wallet used for the policy transaction for the full duration of the cover policy.'
      ]
    }
  },
  {
    parameter: 'Cover Parameters',
    type: 'parameter',
    text: 'All of the following parameters must be applicable for the policy to be validated:',
    list: {
      type: 'ordered',
      items: [
        'Minimum total loss of user funds from the reported incident should exceed $5 million.',
        'The designated protocol suffers a hack of user funds in which the user funds are permanently and irrecoverably stolen from the protocol.',
        'The loss arises from a smart contract vulnerability.',
        'The loss must arise from one of the following blockchains: Ethereum.'
      ]
    }
  },
  {
    parameter: 'Cover Exclusions',
    type: 'exclusion',
    list: {
      type: 'ordered',
      items: [
        'Incident on any blockchain that is not supported by this cover.',
        'Frontend, hosting, server or network infrastructure, database, DNS server, CI/CD, and/or supply-chain attacks.',
        'All exclusions present in the standard terms and conditions.'
      ]
    }
  }
]

const List = ({ type, children }) => {
  if (type === 'unordered') {
    return <ul className='pl-5 list-disc'>{children}</ul>
  }
  if (type === 'ordered') {
    return <ol className='pl-5 list-decimal'>{children}</ol>
  }
}

const CoverParameters = ({ parameters = mockParameters }) => {
  return parameters.map((param, i) => (
    <div key={i}>
      <h4 className='mt-10 mb-6 font-semibold text-h4 font-sora'>
        {param.parameter}
      </h4>
      <p className='mb-4'>
        {param.text}
      </p>

      <List type={param.list.type}>
        {param.list.items.map((item, x) => (
          <li key={x}>{item}</li>
        ))}
      </List>

    </div>
  ))
}

export { CoverParameters }
