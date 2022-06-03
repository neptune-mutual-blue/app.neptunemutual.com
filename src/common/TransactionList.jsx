import { VARIANTS } from "@/lib/toast/message";
// import * as Dialog from "@radix-ui/react-dialog";
import { ModalRegular } from "@/common/Modal/ModalRegular";
import { t } from "@lingui/macro";

const mockTxns = [
  {
    id: 1,
    status: "Error",
    title: "Reporting Clearpool Incident",
    date: "3h ago",
    value: "200,000 NPM",
  },
  {
    id: 1,
    status: "Success",
    title: "Reporting Clearpool Incident",
    date: "3h ago",
    value: "200,000 NPM",
  },
  {
    id: 1,
    status: "Success",
    title: "Reporting Clearpool Incident",
    date: "3h ago",
    value: "200,000 NPM",
  },
  {
    id: 1,
    status: "Loading",
    title: "Reporting Clearpool Incident",
    date: "3h ago",
    value: "200,000 NPM",
  },
  {
    id: 1,
    status: "Loading",
    title: "Reporting Clearpool Incident",
    date: "3h ago",
    value: "200,000 NPM",
  },
];

export function TransactionList({
  isOpen = false,
  onClose,
  container,
  ...rest
}) {
  return (
    <ModalRegular
      isOpen={isOpen}
      onClose={onClose}
      rootProps={{ modal: true }}
      className="px-4 py-1 w-96 max-w-96 rounded-3xl bg-3A4557 text-FEFEFF absolute top-96 -left-36"
      container={container}
      {...rest}
    >
      <div className="font-poppins">
        <div className="mb-10">
          {mockTxns.map((txn) => (
            <div className="py-4 flex border-b border-B0C4DB/40" key={txn.id}>
              <div className="mr-4">{VARIANTS[txn.status].icon}</div>
              <div className="mr-4 grow">
                <p className="text-sm font-bold font-sora">{txn.title}</p>
                <p>{txn.value}</p>
                <p className="text-xs text-999BAB font-sora">{txn.date}</p>
              </div>
              <button className="flex items-center self-end whitespace-nowrap text-4289F2 text-xs">
                {t`View Tx`} &gt;
              </button>
            </div>
          ))}
        </div>
        <div className="text-center pb-3">
          <a href="#" className="underline">
            {t`View More`}
          </a>
        </div>
      </div>
    </ModalRegular>
  );
}
