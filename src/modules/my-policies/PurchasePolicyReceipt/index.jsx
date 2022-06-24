import { BackButton } from "@/common/BackButton/BackButton";
import { HeaderLogo } from "@/common/HeaderLogo";
import OpenInNewIcon from "@/icons/OpenInNewIcon";
import LinkedinIcon from "@/icons/LinkedinIcon";
import RedditIcon from "@/icons/RedditIcon";
import TelegramIcon from "@/icons/TelegramIcon";
import TwitterIcon from "@/icons/TwitterIcon";
import { OutlinedButton } from "@/common/Button/OutlinedButton";
import DownloadIcon from "@/icons/DownloadIcon";
import AddCircleIcon from "@/icons/AddCircleIcon";
import { DescriptionComponent } from "@/modules/my-policies/PurchasePolicyReceipt/DescriptionComponent";

export const PurchasePolicyReceipt = () => {
  const purchaser = "0xBF2096BAC289aA0581148955427397B522F9e5D4";

  const policyName = "Uniswap";
  const date = 1654858586326;
  const receiptNo = "3247";

  const policyInfo =
    "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Accusamus molestias suscipit assumenda consequatur harum molestiae minus autem iure et, eveniet nam esse facilis quaerat possimus temporibus amet? Recusandae porro consectetur iusto magni.";

  const cxDaiAddress = "0x278Ff5154249786b0Dfe9Ef4433fAb3DF7fcd786";

  const txHash =
    "0x63ef5603e38996de2d810aaf1193ef19168ca2807a4f8557568653772740235b";

  const coverRules = [
    "Carefully read the following terms and conditions. For a successful claim payout, all of the following points must be true.",
    [
      "You must have maintained at least 1 NPM tokens in your wallet during your coverage period.",
      "During your coverage period, the platform was exploited which resulted in user assets being stolen and the project was also unable to cover the loss themselves.",
      "This does not have to be your own loss.",
    ],
  ];

  const exclusions = "Exclusions added by the cover creator";

  const standardExclusions = [
    "The standard exclusions are enforced on all covers. Neptune Mutual reserves the right to update the exclusion list periodically.",
    [
      "If we have reason to believe you are an attacker or are directly or indirectly associated with an attacker, we reserve the right to blacklist you or deny your claims.",
      <>
        In addition to{" "}
        <a href="#" className="text-4e7dd9">
          coverage lag
        </a>
        , we may also blacklist you or deny your claims if you purchased
        coverage just before, on, or the same day of the attack.
      </>,
      "Minimum total loss should exceed $1 million.",
      "Any loss in which the protocol continues to function as intended is not covered.",
      "Any type of 51 percent attack or consensus attack on the parent blockchain is not covered.",
      "Consensus attack on the protocol is not covered.",
      "Financial risk can not be covered.",
      "Bridge-related losses not coverable.",
      "Backend exploits are not coverable.",
      "Gross negligence or misconduct by a project's founders, employees, development team, or former employees are not coverable.",
      [
        "Rug pull or theft of funds.",
        "Project team confiscating user funds. ",
        "Attacks by team members or former team members on their protocol.",
        "Compromised private key.",
        "Compromised API access keys.",
        "Utilization of obsolete or vulnerable dependencies in the application or DApp before the coverage period began",
        "Developers or insiders creating backdoors to later exploit their own protocol.",
      ],
    ],
  ];

  const riskDisclosure = [
    "In case of a diversified cover liquidity pool, it will only be able to offer payouts upto the pool's balance. It is critical that you comprehend all risk aspects before establishing any firm expectations. Please carefully assess the following document:",
    <a
      href="https://docs.neptunemutual.com/usage/risk-factors"
      key={"1235"}
      className="text-4e7dd9"
    >
      https://docs.neptunemutual.com/usage/risk-factors
    </a>,
  ];

  const socials = [
    {
      Icon: TwitterIcon,
    },
    {
      Icon: RedditIcon,
    },
    {
      Icon: TelegramIcon,
    },
    {
      Icon: LinkedinIcon,
    },
  ];

  const data = [
    {
      label: "On Behalf of",
      value: (
        <p className="flex items-center gap-2 text-lg leading-6">
          0xBF2096BAC289aA0581148955427397B522F9e5D4
          <a href="#">
            <OpenInNewIcon className="w-4 h-4" fill="#DADADA" />
          </a>
        </p>
      ),
    },
    {
      label: "Protection",
      value: "29,500 DAI",
    },
    {
      label: "Premium Rate",
      value: "8.5%",
    },
    {
      label: "Duration",
      value: "2 months",
    },
    {
      label: "Start Date",
      value: "Sat, 18 Jun 2022 11:55:33 GMT",
    },
    {
      label: "End Date",
      value: "Sat, 18 Aug 2022 11:55:33 GMT",
    },
    {
      label: "Referral",
      value: "0093UE-00X-REF-001",
    },
  ];

  const premuimPaid = "532.3422 DAI";

  return (
    <div>
      <div className="py-9.5 px-13 bg-black text-white">
        <BackButton
          onClick={() => {}}
          className="!px-4 !py-2 border-white !text-white hover:bg-transparent hover:text-white"
        />

        <div className="mt-9 px-42 font-sora">
          <HeaderLogo />
          <a
            href="https://neptunemutual.com"
            className="mt-2 underline text-4e7dd9"
          >
            neptunemutual.com
          </a>

          <p className="mt-5 text-sm font-semibold leading-6">Purchaser:</p>
          <p className="flex items-center gap-2 text-lg leading-6">
            {purchaser}
            <a href="#">
              <OpenInNewIcon className="w-4 h-4" fill="#DADADA" />
            </a>
          </p>
        </div>
      </div>

      <div className="bg-white px-54 pt-14 pb-52">
        <h1 className="font-semibold leading-8 text-receipt-info font-sora">
          {policyName} Policy Receipt
        </h1>

        <div className="text-lg leading-6 font-sora text-9B9B9B mt-3.5">
          <p className="font-semibold">Date:</p>
          <p>{new Date(date).toUTCString()}</p>
        </div>

        <div className="mt-4 text-lg leading-6 font-sora text-9B9B9B">
          <p className="font-semibold">Receipt no:</p>
          <p>{receiptNo}</p>
        </div>

        <p className="mt-8">{policyInfo}</p>

        <div className="mt-6">
          <p>Share it with your friends for surprise gift!</p>
          <div className="flex gap-4 mt-4">
            {socials.map(({ Icon }, idx) => (
              <a key={idx} href="#">
                <Icon className="w-6 h-6 text-black" />
              </a>
            ))}
          </div>
        </div>

        <OutlinedButton
          onClick={() => {}}
          className="flex items-center gap-2 p-4 mt-12 rounded-lg border-4e7dd9 text-4e7dd9"
        >
          <DownloadIcon />
          <span className="font-semibold uppercase">
            Download Product Cover Terms
          </span>
        </OutlinedButton>

        <div className="mt-16 divide-y divide-9B9B9B">
          {data.map(({ label, value }, i) => (
            <div
              key={i}
              className="flex justify-between pt-6 pb-4 text-lg leading-6"
            >
              <p className="font-semibold font-sora">{label}</p>
              <p className="font-poppins">{value}</p>
            </div>
          ))}

          <div className="flex justify-between py-5 text-lg font-bold leading-6 !border-y-2 !border-y-404040">
            <p className="font-sora">Premium Paid</p>
            <p className="uppercase font-poppins">{premuimPaid}</p>
          </div>

          <div className="py-8 !border-t-0 !border-b-2 !border-y-404040 text-lg leading-6">
            <p className="font-semibold font-sora">Your cx DAI Address</p>
            <div className="flex items-center gap-3 mt-1.5">
              {cxDaiAddress}
              <a href="#">
                <OpenInNewIcon className="w-4 h-4" fill="#AAAAAA" />
              </a>
              <button>
                <AddCircleIcon className="w-4 h-4" fill="#AAAAAA" />
              </button>
            </div>

            <p className="mt-6 font-semibold font-sora">View Transaction</p>
            <div className="flex items-center gap-3 mt-1.5">
              {txHash}
              <a href="#">
                <OpenInNewIcon className="w-4 h-4" fill="#AAAAAA" />
              </a>
            </div>
          </div>
        </div>

        <DescriptionComponent
          title={"Cover Rules"}
          text={coverRules}
          className="mt-14"
        />

        <DescriptionComponent
          title={"Exclusions"}
          text={exclusions}
          className="mt-8"
        />

        <DescriptionComponent
          title={"Standard Exclusions"}
          text={standardExclusions}
          className="mt-8"
        />

        <DescriptionComponent
          title={"Risk Disclosure / Disclaimer"}
          titleClassName="!text-lg"
          text={riskDisclosure}
          className="mt-8"
        />
      </div>
    </div>
  );
};
