import { DescriptionComponent } from '@/modules/cover/cover-terms/DescriptionComponent'
import React from 'react'

export const StandardsTerms = ({ className = '' }) => {
  return (
    <div className={className}>
      <h1 className='text-000000 text-h1'>Standard Terms and Conditions</h1>

      <DescriptionComponent
        title='Standard Cover Policy Limitations'
        wrapperClass='mt-5'
        bullets={['Cover policies relate exclusively to the risk of hack of smart contracts, or from a limited number of cybersecurity threats. Financial and other risks are not covered. Unless stated otherwise in cover parameters, only smart contract hack is covered.', 'Minimum total loss of user funds should exceed $1 million per cover product.']}
      />

      <DescriptionComponent
        title='Blacklisting'
        wrapperClass='mt-5'
        bullets={['Neptune Mutual Association retains the right to blacklist any wallet, at its own discretion, to block access to all of the features and functionality of the Neptune Mutual dApp without notice or reason to the wallets’ owners.', 'Neptune Mutual Association reserves the right to block IP addresses from accessing the Neptune Mutual dApp from certain countries in relation to anti-money laundering, sanctioned entities listed on economic/trade embargo lists.']}
      />

      <DescriptionComponent
        title='Unsupported Regions'
        wrapperClass='mt-5'
        bullets={[
          <React.Fragment key={1}>
            No access will be granted to the dApp from residents and citizens of the US and US Territories or in other words, both <a className='text-2151B0' href='https://en.wikipedia.org/wiki/United_States_person' target='_blank' rel='noreferrer'>US Person</a> and a <a className='text-2151B0' href='https://www.lawinsider.com/dictionary/us-taxpayer' target='_blank' rel='noreferrer'>US Taxpayer</a>.
          </React.Fragment>,
          'Neptune Mutual Association reserves the right to add additional countries to the list of unsupported regions for any reasons at the discretion of Neptune Mutual Association.']}
      />

      <DescriptionComponent
        title='Exclusions'
        wrapperClass='mt-5'
        bullets={[
          'Any loss in which a covered project continues to function as intended is not covered.',
          'Incidents refer to the point in time in which a hack, or breach of cybersecurity, takes place. If a loss of user funds occurs within the cover period as a result of a hack that occurs outside the duration of the cover, then the incident shall be deemed not to be valid, and the loss of user funds shall therefore be excluded. Equally, if there is a publicly available disclosure of a bug prior to the start of the cover period, then any incident relating to this bug will be excluded.', 'Where the cover pool project is a fork of another protocol, then a publicly available disclosure of a bug on the original protocol prior to the start of the cover period will also be excluded (because as the code is the same, the same reason applies).']}
        childLists={[
          {
            parent: 0,
            bullets: ['One or multiple admin private key leaks, hacks, or exploits that enable an attacker to drain funds of a covered project directly or through a multi-sig operation is not covered.', 'Timestamp-based attacks, transaction ordering, front running, MEV, or any financial exploit is not covered.']
          }
        ]}
      />

      <DescriptionComponent
        title={<p className='font-semibold'>Attack Vectors That Are Excluded from Cover</p>}
        wrapperClass='mt-5'
        bullets={[
          'Loss resulting from social engineering, phishing, and malware attacks',
          'Loss resulting from identity theft (e.g. Discord moderator account compromise)',
          'Loss resulting from Oracle failure',
          'Loss resulting from blockchain outage',
          'Loss arising from a 51 percent attack or consensus attack on the host blockchain is not covered. Or Loss resulting from consensus attack on a protocol is not covered.',
          'Bridge-related losses are not covered.',
          'Loss resulting from flash loan attacks.',
          'Loss resulting from front-end bugs (the code covered by parametric policies must be deployed on a blockchain).',
          'Loss resulting from front running, transaction ordering attacks, sandwich attacks, and Maximum Extractable Value (MEV) related attacks.',
          'Cover creator, product company, their respective employees or any entities affiliated with cover creator or product company,  have been involved in any violation of compliance laws, rules, regulations, or policies of any jurisdiction within which they conduct business.',
          'Exploits on backend and closed systems are not coverable unless explicitly mentioned in the cover parameters.',
          "Gross negligence or misconduct by a project's founders, employees, development team, or former employees are not coverable."
        ]}
        childLists={[
          {
            parent: 11,
            bullets: [
              'Rug pull or theft of funds.',
              'Project team confiscating user funds.',
              'Attacks by team members or former team members on their protocol.',
              'Inability to safeguard private key, mnemonic phrase, or cryptocurrency wallet.',
              'Compromised API access keys.',
              'Utilization of obsolete or vulnerable dependencies in the dApp or DApp before the coverage period began.',
              'Developers or insiders creating backdoors to later exploit their own protocol.',
              'Admin rights and off-limit functionality: unauthorized access to any function or contract where access is white-listed or entirely disallowed is excluded.'
            ]
          }
        ]}
      />

      <DescriptionComponent
        title='Denied Claims'
        wrapperClass='mt-5'
        bullets={[
          'If we have reason to believe you are an attacker or are directly or indirectly associated with an attacker, we reserve the right to deny your claims and add your address to the blacklist.',
          'If we have reason to believe you are directly or indirectly associated with the cover creator or project/protocol team and were privy to private information about a security weakness or bug prior to the incident we reserve the right to deny your claims and add your address to the blacklist.',
          'In addition to coverage lag, we may also deny your claims if you purchased coverage just before, on, or the same day of the attack.',
          'The governance committee of the Neptune Mutual Association reserves the right to perform an emergency resolution of the Incident Reporting process, and thereby deny all payout claims of an incident, if it has reason to believe the incident reporting process itself is under attack from malicious reporters; an attack on the reporting process could take different forms including a 51% attack, a timing attack, or a corrupt governance agent attack  '
        ]}
      />

      {/* Terms and Conditions */}
      <h2 className='mt-5 text-h2'>Terms and Conditions</h2>

      <ul className='pl-6 mt-5 list-decimal'>
        <DescriptionComponent
          title={<li className='font-semibold'>dApp Terms & Conditions</li>}
          wrapperClass='mt-5'
          text='All users of the Neptune Mutual dApp, including any visitors, cover creators, liquidity providers, cover purchasers, and the NPM tokenholder community, agree to abide by the standard terms & conditions and standard exclusions of the Neptune Mutual dApp, and all policies that govern the Neptune Mutual dApp; a link to these will be published on the Neptune Mutual website and maybe updated from time-to-time without upfront notice.'
        />

        <DescriptionComponent
          title={<li className='font-semibold'>Contact</li>}
          wrapperClass='mt-5'
          text={[
            'The Neptune Mutual dApp is governed by the Neptune Mutual Association, based in Zug, Switzerland. Contact details are:',
            <React.Fragment key={1}>
              <p>Poststrasse 24 / 6302 Zug, Switzerland</p>
              <p>Contact form available on website:  https://neptunemutualassociation.org</p>
            </React.Fragment>
          ]}
        />

        <DescriptionComponent
          title={<li className='font-semibold'>Access</li>}
          wrapperClass='mt-5'
          text={[
            'Access to the dApp, including any of its subdomains, and including access via integrations with cover creator or partner websites, is provided as available only. Access may be interrupted and users bear the full risk of any interruptions or inaccessibility to the Neptune Mutual dApp.',
            'By accessing the dApp you agree to comply with the standard terms & conditions and standard exclusions herein and all locally domestic and international laws, statutes and regulations applicable to your use of the dApp.'
          ]}
        />

        <DescriptionComponent
          title={<li className='font-semibold'>Eligibility</li>}
          wrapperClass='mt-5'
          listStyle='decimal'
          listItemClass='font-semibold mt-4'
          bullets={[
            'Eligibility requirements',
            'Compliance with Anti-Terrorism, Embargo, Sanctions and Anti-Money Laundering Laws'
          ]}
          childLists={[
            {
              parent: 0,
              text: [
                'Prior to accessing the Neptune Mutual dApp, you warrant that you have the full legal capacity and authority in your jurisdiction to accept the Terms and be bound by them.',

                'You represent and warrant that you are not resident of, or hold the nationality of, a country subject to sanctions or otherwise designated on any list of prohibited or restricted parties or owned or controlled by such a party, including the lists maintained by the United Nations Security Council, the US Government (e.g., the US Department of Treasury’s Specially Designated Nationals list and Foreign Sanctions Evaders list, the US Department of Commerce’s Entity List, Office of Foreign Asset Control’s sanction list), the European Union or its member states, or other applicable government authority.'
              ]
            },
            {
              parent: 1,
              text: 'All users of the Neptune Mutual dApp shall comply with all Legal Requirements relating to money laundering, anti-terrorism, trade embargoes and economic sanctions, now or hereafter in effect.'
            }
          ]}
          ulClass='mt-0'
        />

        <DescriptionComponent
          title={<li className='font-semibold'>Risks</li>}
          wrapperClass='mt-5'
          text='The Neptune Mutual dApp is subject to various risks including but not limited to financial risk as well as to the risk of cyber attack. You acknowledge that the use of the Neptune Mutual dApp is entirely at your own risk. Neptune Mutual Association, nor any other party associated with the development or operation of the Neptune Mutual dApp, is responsible in any way for loss of your digital assets or loss in value of your assets.'
        />

        <DescriptionComponent
          title={<li className='font-semibold'>Neptune Mutual Community</li>}
          wrapperClass='mt-5'
          text={[
            'All stakeholders within the Neptune Mutual community undertake to act in good faith with respect to each other’s rights. Cover policies are designed exclusively to mitigate community members against the risk to digital assets as a result of a hack.',

            'Cover policies are not intended to be used as tools for hackers to leverage illicit gains, or for community members, or anyone else, to try and benefit from information about such activity. Neptune Mutual Association reserves its rights to blacklist, block, and/or carry any actions against any user who conducts malicious activities or leverages illicit gains by using Neptune Mutual dApp.'
          ]}
        />

        <DescriptionComponent
          title={<li className='font-semibold'>Cover Creators</li>}
          wrapperClass='mt-5'
          listStyle='decimal'
          bullets={[
            'The Cover Creator bears the full responsibility for writing the cover rules that determine the conditions precedent for payout of the cover policy.',
            'The Cover Creator bears the entire risk of the use of the Neptune Mutual dApp. In no event shall Neptune Mutual Association, nor any of their officers, Directors, employees, members or licensors be liable for any consequential, incidental, direct, indirect punitive or other damages whatsoever.',
            'The Cover Creator agrees that Neptune Mutual Association is not an agent for the Cover Creator, nor for the cover policy buyer, nor for the cover pool liquidity supplier, and has no authority to act on behalf of any of these parties.',
            'The Cover Creator agrees to follow the rules set out in the Cover Creator Guide when formulating the parameters of the cover policy of their cover pool.',
            'Information Provided by Cover Creator'
          ]}
          childLists={[
            {
              parent: 4,
              text: 'Cover Creator agrees and warrants that all information provided, including any information that may impact the understanding of a reported incident:',
              bullets: [
                '(a) will be truthful, accurate and not misleading or otherwise deceptive;',
                '(b) will not violate the intellectual property rights of any third party such as copyright, patent, trademark, trade secret or other proprietary rights, rights of publicity or privacy',
                '(c) will not violate any law, statute, ordinance or regulation in any competent jurisdictions;',
                '(d) will not be defamatory, trade libelous, unlawfully threatening or unlawfully harassing, or in violation of common business practice.; and,',
                '(e) will not create liability for Neptune Mutual Association.'
              ],
              listStyle: 'decimal',
              parentClass: 'font-semibold',
              ulClass: '!pl-12'
            }
          ]}
        />

        <p className='mt-5'>
          Cover Creator agrees that any and all Cover Creator content may be publicly displayed by the Neptune Mutual dApp as Neptune Mutual Association sees fit, and at no charge to Neptune Mutual Association.
        </p>

        <p className='mt-5'>
          Cover Creator grants and warrants that Cover Creator has the right to grant to Neptune Mutual Association, an irrevocable, perpetual, sub licensable, transferable, non-exclusive, royalty-free and fully paid-up, worldwide right and license to use, copy, transmit, perform, display, incorporate and embed such content into the dApp, and Cover Creator agrees that the content made available to Neptune dApp is the final version of such content and the Cover Creator understands that such content may not be amended, revised, deleted, add or in any manner deviated from the original version.
        </p>

        <DescriptionComponent
          title={<li className='font-semibold'>Cover Purchasers</li>}
          wrapperClass='mt-5'
          text={[
            'Cover purchasers agree to be fully bound by the terms of the parameters and other terms of the cover policy that they choose to purchase in the Neptune Mutual dApp.',

            'Cover purchasers understand and agree that when buying a cover policy from a cover pool listed on the Neptune Mutual dApp, these transactions take place on chain and independently from the Neptune Mutual Association.'
          ]}
          ulClass='pl-12 list-decimal'
          listItemClass='font-semibold'
          bullets={[
            'Qualifying for a Cover Policy Payout',
            'Cover Policy Payout Risks'
          ]}
          childLists={[
            {
              parent: 0,
              text: 'To qualify for a payout, arising when there is a claimable incident from a cover pool from which you have policy, the Event date and the Incident Reporting Date must occur within the duration of the cover policy.'
            },
            {
              parent: 1,
              text: 'For both dedicated and diversified cover pools, cover policyholders should be aware that there is a risk that if the Neptune Mutual protocol is hacked, and liquidity pools drained, this event may mean that policyholders do not receive a payout.',
              bullets: [
                {
                  title: 'Dedicated Cover Pool: Guaranteed Payout',
                  text: 'Dedicated cover pools are dedicated to the security risks of one single project protocol. Liquidity in a dedicated cover pool is always greater than the combined payout liability of all cover policies, if Neptune Mutual protocol is not hacked.'
                },
                {
                  title: 'Diversified Cover Pool:',
                  text: [
                    'A diversified cover pool provides liquidity to a portfolio of cover projects (cover products) each with their own parametric cover policy.',

                    'It is possible that, if multiple incidents arise across different cover projects within the diversified cover pool, there is insufficient liquidity to payout all claims. In this instance, cover liquidity will be used to payout incidents of cover products on a first come first served basis.'
                  ]
                }
              ],
              ulClass: '!pl-12',
              listItemClass: 'font-semibold mt-4',
              listStyle: 'decimal'
            }
          ]}
        />

        <DescriptionComponent
          title={<li className='font-semibold'>Liquidity Providers</li>}
          wrapperClass='mt-5'
          text={[
            'Neptune Mutual Association is not liable to any loss, either in relation to the principal or interest, resulting from default, hack or exploit of the protocols to which cover pools lend funds as part of the yield optimisation strategies.',

            'Liquidity providers understand and agree that when providing liquidity in a cover pool, or in any of the staking pools, in the Neptune Mutual dApp, these transactions take place on chain and independently from the Neptune Mutual Association.'
          ]}
        />

        <DescriptionComponent
          title={<li className='font-semibold'>Incident Reporting</li>}
          wrapperClass='mt-5'
          text='All stakeholders and users of the Neptune Mutual dApp must accept the final decision of the Incident Reporting process of the Neptune Mutual dApp, governed by Neptune Mutual Association.'
        />

        <DescriptionComponent
          title={<li className='font-semibold'>Fees</li>}
          wrapperClass='mt-5'
          listStyle='decimal'
          listItemClass='font-semibold'
          bullets={[
            'Protocol Fees',
            'Protocol Fees Modification'
          ]}
          childLists={[
            {
              parent: 0,
              text: 'Cover Creator agrees to the protocol fees and to the token staking and burning requirements of the Neptune Mutual dApp, as detailed in the Neptune Mutual documentation, available on the Neptune Mutual website.'
            },
            {
              parent: 1,
              parentClass: 'mt-4',
              text: 'Protocol fees may be subjected to change and revision from time to time; the Cover creator acknowledges such changes and agrees to refer to Neptune Mutual documentation and Neptune Mutual website for updated fees.'
            }
          ]}
        />

        <DescriptionComponent
          title={<li className='font-semibold'>Code of Conduct</li>}
          wrapperClass='mt-5'
          listStyle='decimal'
          bullets={[
            'Everyone who participates in the Neptune Mutual dApp should abide by the code of conduct, as set out in detail in the documents section of the Neptune Mutual website.',
            'Code of Conduct Violations (nontechnical)'
          ]}
          childLists={[
            {
              parent: 1,
              parentClass: 'mt-4 font-semibold',
              textClass: 'pl-0',
              text: 'The Neptune Mutual Association Telegram moderation panel is a small group of both team members and collaborators from the community who have earned the trust of the project team. The Telegram moderation panel handles nontechnical code of conduct violations, has access to community moderation tools, and helps keep the Neptune Mutual community motivated, safe, and positive.'
            }
          ]}
        />

        <DescriptionComponent
          title={<li className='font-semibold'>Warranty & Disclaimer</li>}
          wrapperClass='mt-5'
          listStyle='decimal'
          listItemClass='font-semibold'
          bullets={[
            'Limitation of Liability',
            'Disclaimer'
          ]}
          childLists={[
            {
              parent: 0,
              text: [
                'By accessing the Neptune Mutual dApp you expressly waive and and release Neptune Mutual Association from any and all liability, damages, claims or legal action arising from use of the dApp or associated smart contracts.',

                'Neither the Neptune Mutual Association, or any other party, shall be liable for any losses or consequential losses resulting from the dApp being unavailable at any time for any reason.',

                `Neptune Mutual Association does not guarantee that the dApp, protocol or any products on the dApp are bug-free, risk-free, error-free and/or free from the risk of hacks.
                Neptune Mutual Association operates the dApp and its products on a “as-is” basis and disclaims any warranties of merchantability, fitness for a particular purpose or any warranties arising from course of performance.`,

                'Neptune Mutual Association does not represent or warrant that all materials on the dApp are complete, reliable, error-free, free from the risk of hacks or free from any unforeseeable and harmful components.',

                'Neptune Mutual Association is not liable for any inaccuracy, defect or omission of data on the blockchain.',

                'Neptune Mutual Association is not responsible for any error, delay or interruption in the transmission of data on the blockchain.',

                'Neptune Mutual Association is not liable to any loss due to maintenance on the protocol.',

                'Neptune Mutual Association is not liable to any loss, either in relation to the principal or interest, resulting from default, hack or exploit of the protocols to which cover pools lend funds as part of the yield optimization strategies.',

                'Users on Neptune Mutual dApp understand that all transactions made on the dApp and dApp are made on-chain, and hence irreversible. Neptune Mutual Association has no right, power or ability to avoid, stop or reverse any transaction made on-chain.'
              ]
            },
            {
              parent: 1,
              parentClass: 'mt-4',
              text: [
                'Neptune Mutual is a decentralized protocol that anyone can use to participate in the NPM cover market and pools using the NPM governance token, digital asset like Ether and stablecoins like DAI, USDC, etc. The source of Neptune Mutual protocol is available under Business Source License 1.1 and is hosted or deployed as a suite of Ethereum contracts.',

                'Your use of the Neptune Mutual protocol involves various risks, including, but not limited to, losses while digital assets are being supplied to the Neptune Mutual protocol, Uniswap, Aave, Compound protocol and other centralized and decentralized exchanges, losses due to the fluctuation of prices of tokens in a trading pair or liquidity pool, losses due to bug in smart contract code, and losses arising from pools, bond pools, cover pools, or any other platform feature.',

                'Before using the Neptune Mutual protocol, you should review the relevant documentation to make sure you understand how the Neptune Mutual protocol works. Additionally, just as you can access email protocols such as SMTP through multiple email clients, you might access the Neptune Mutual protocol through dozens of other non-official web or mobile interfaces. You are responsible for doing your own diligence on those interfaces to understand the fees and risks they present. In general, you hereby understand and acknowledge that you are aware of all risks in relation to digital assets, blockchain, decentralized protocol, regulatory, and cyber securities.'
              ]
            }
          ]}
        />

        <DescriptionComponent
          title={<li className='font-semibold'>Definitions of Cover Policy Terms</li>}
          wrapperClass='mt-5'
          listStyle='decimal'
          listItemClass='font-semibold mt-4'
          ulClass='mt-0'
          bullets={[
            'Dedicated Cover Pool',

            'Diversified Cover Pool',

            'Diversified Cover Pool Product',

            'Event',

            'Event Date',

            'Incident',

            'Observed Date or Incident Date',

            'Reporting Date',

            'Loss',

            'Loss Date',

            'Qualifying Loss',

            'Claim Expiry Date',

            'Duration',

            'Lag Period or Lag Duration',

            'Incident Occurred',

            'False Reporting',

            'Reporting Period',

            'Claimable',

            'Payout',

            'Leverage Factor',

            'Capital Efficiency',

            'Utilization Ratio',

            'Cover Fee'
          ]}
          childLists={[
            { parent: 0, textClass: 'pl-0', text: 'A cover pool for an individual project, team, or a community wherein the creators design parametric cover policies specific to protect against security risks relevant to their project. Each dedicated cover pool has its own dedicated liquidity and therefore payout is guaranteed.' },
            { parent: 1, textClass: 'pl-0', text: 'Diversified cover pools provide liquidity to a portfolio of sub cover pools also known as cover pool products, each with their own specific cover policy trigger parameters. These are a combination of dedicated cover pools, grouped together into a single portfolio pool.' },
            { parent: 2, textClass: 'pl-0', text: 'Diversified cover pool products also offer cover and protection. However, unlike dedicated pools, the diversification of a cover pool means that the liquidity of the pool is shared over a larger number of pools. Payout is not guaranteed.' },
            { parent: 3, textClass: 'pl-0', text: 'A hack of a cover pool project.' },
            { parent: 4, textClass: 'pl-0', text: 'The date of the Event.' },
            { parent: 5, textClass: 'pl-0', text: 'An Event that has been reported in the Neptune Mutual dApp.' },
            { parent: 6, textClass: 'pl-0', text: 'Timestamp when transaction was submitted and block was mined. The date the Incident was reported.' },
            { parent: 7, textClass: 'pl-0', text: 'The UTC timestamp when an incident report is submitted to the Neptune Mutual protocol or Neptune Mutual smart contract(s).' },
            { parent: 8, textClass: 'pl-0', text: 'The loss of a digital asset resulting from an Event.' },
            { parent: 9, textClass: 'pl-0', text: 'The date that the cover project incurred a loss.' },
            { parent: 10, textClass: 'pl-0', text: 'A loss that meets the minimum conditions of both the Neptune Mutual exclusions list, and also the minimum loss specified by the cover creator in the parameters of the policy.' },
            { parent: 11, textClass: 'pl-0', text: 'The date on which a cover policy expires.' },
            { parent: 12, textClass: 'pl-0', text: 'The active days of a cover policy (excluding the lag period).' },
            { parent: 13, textClass: 'pl-0', text: 'The Lag Period is a specified time period that can be set globally or on a per-cover basis to delay the start of coverage. The coverage of a policy begins at the EOD timestamp of the policy purchase date plus the coverage lag.' },
            { parent: 14, textClass: 'pl-0', text: 'This is one of the two cover incident resolutions in which token holders add attestation, indicating that they believe and support the reported incident.' },
            { parent: 15, textClass: 'pl-0', text: 'This is one of the two cover incident resolutions in which token holders add refutation, indicating that they disagree with the reported incident.' },
            { parent: 16, textClass: 'pl-0', text: 'A duration opened for users to participate in the Governance process, as soon as the first report is submitted. Users can participate in this period by attesting to, or refuting the incident by setting up their supporting stakes.' },
            { parent: 17, textClass: 'pl-0', text: 'The cover status in which users can file a claim to their purchased coverage once the resolution has been achieved.' },
            { parent: 18, textClass: 'pl-0', text: 'The amount received against your submitted claims. Payouts can only occur when all cover conditions are met, the incident date falls within your coverage period, no exclusions are present, and the incident is successfully resolved by the community in your favor.' },
            { parent: 19, textClass: 'pl-0', text: 'The leverage factor is a multiplier that can be used, exclusively in diversified cover pools, to calculate the dollar amount of cover policies that can be underwritten by the diversified cover pool.' },
            { parent: 20, textClass: 'pl-0', text: 'Is a divisor that is used, exclusively in diversified cover pools, to calculate the weight of diversified cover pool liquidity collectively allocated to the respective cover products in the portfolio. A capital efficiency of 100% for each product means that each product will get an equal proportion of the diversified cover pool liquidity.' },
            { parent: 21, textClass: 'pl-0', text: 'Ratio of total commitment to total liquidity.' },
            { parent: 22, textClass: 'pl-0', text: 'The amount required in stable-coin to purchase the policy for the specified amount.' }
          ]}

        />
      </ul>
    </div>
  )
}
