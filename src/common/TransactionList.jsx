import MinimizeIcon from "@/icons/MinimizeIcon";
import { VARIANTS } from "@/lib/toast/message";
import * as Popover from "@radix-ui/react-popover";
import { useState } from "react";

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
  {
    id: 1,
    status: "Loading",
    title: "Reporting Clearpool Incident",
    date: "3h ago",
    value: "200,000 NPM",
  },
];

export function TransactionList() {
  const [selected, setSelected] = useState(null);

  return (
    <Popover.Root>
      <Popover.Trigger>Trigger</Popover.Trigger>
      <Popover.Content className="px-4 py-1 mt-3.5 w-96 rounded-3xl bg-3A4557 text-FEFEFF">
        {selected ? (
          <div className="px-2 py-6">
            <div className="flex mb-2" key={selected.id}>
              <div className="mr-4">{VARIANTS[selected.status].icon}</div>
              <div className="mr-4 grow">
                <p className="text-sm font-bold">{selected.title}</p>
                <p>{selected.value}</p>
                <p className="text-xs text-999BAB">{selected.date}</p>
              </div>
              <button
                className="self-start"
                onClick={() => {
                  setSelected(null);
                }}
              >
                <MinimizeIcon
                  className="w-6 h-6 text-999BAB"
                  aria-hidden="true"
                />
              </button>
            </div>
            <div className="mb-2">
              <p className="text-sm">
                Your transaction was submitted successfully.
              </p>
            </div>
            <div className="mb-8">
              <p className="text-xs opacity-60">
                For most cases, it only takes a few minutes for a transaction to
                get included in the blockchain network. If you see your
                transaction is taking too long to process, the network may be
                experiencing high traffic.
              </p>
            </div>
            <div>
              <a href="#" className="underline">
                View on Explorer
              </a>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-10">
              {mockTxns.map((txn) => (
                <div className="py-4 flex border-b border-B0C4DB" key={txn.id}>
                  <div className="mr-4">{VARIANTS[txn.status].icon}</div>
                  <div className="mr-4 grow">
                    <p className="text-sm font-bold">{txn.title}</p>
                    <p>{txn.value}</p>
                    <p className="text-xs text-999BAB">{txn.date}</p>
                  </div>
                  <button
                    className="flex items-center self-end whitespace-nowrap text-4289F2 text-xs"
                    onClick={() => {
                      setSelected(txn);
                    }}
                  >
                    View Tx &gt;
                  </button>
                </div>
              ))}
            </div>
            <div className="text-center pb-3">
              <a href="#" className="underline">
                View on Explorer
              </a>
            </div>
          </div>
        )}
      </Popover.Content>
    </Popover.Root>
  );
}
