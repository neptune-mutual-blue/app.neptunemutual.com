import { ModalRegular } from "@/common/Modal/ModalRegular";
import { t } from "@lingui/macro";
import { useEffect, useState } from "react";
import { LSHistory } from "@/src/services/transactions/history";
import { convertToIconVariant } from "@/common/TransactionList/helpers";
import { getActionMessage } from "@/src/helpers/notification";
import { getTxLink } from "@/lib/connect-wallet/utils/explorer";
import { useNetwork } from "@/src/context/Network";
import { fromNow } from "@/utils/formatter/relative-time";
import { useRouter } from "next/router";
import { TransactionHistory } from "@/src/services/transactions/transaction-history";

export function TransactionList({
  isOpen = false,
  onClose,
  container,
  ...rest
}) {
  const [
    /**
     * @type {import('@/src/services/transactions/history').IHistoryEntry[]}
     */
    listOfTransactions,
    /**
     * @type {(state: import('@/src/services/transactions/history').IHistoryEntry[]) => void}
     */
    setListOfTransactions,
  ] = useState([]);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);

  const showMore = (event) => {
    event.preventDefault();

    if (page < maxPage) {
      setPage((curPage) => curPage + 1);
    }
  };

  useEffect(() => {
    if (isOpen) {
      const history = LSHistory.get(page);
      setListOfTransactions((current) => {
        const hashes = current.map(({ hash }) => hash);

        return [
          ...current,
          ...history.data.filter((item) => !hashes.includes(item.hash)),
        ];
      });
      setMaxPage(history.maxPage);

      const updateListener = TransactionHistory.on((item) => {
        setListOfTransactions((items) =>
          items.map((_item) => {
            if (_item.hash === item.hash) {
              Object.assign(_item, item);
            }

            return _item;
          })
        );
      });

      return () => {
        updateListener.off();
      };
    }

    setListOfTransactions([]);
    setPage(1);
    setMaxPage(1);
  }, [isOpen, page]);

  return (
    <ModalRegular
      isOpen={isOpen}
      onClose={onClose}
      rootProps={{ modal: true }}
      overlayClass="flex justify-end w-full h-full bg-transparent"
      defaultContentClassNames="absolute z-50 transform top-full right-5 pt-3 rounded-3xl"
      container={container}
      {...rest}
    >
      <div className="pl-4 font-poppins bg-3A4557 text-FEFEFF rounded-3xl shadow-tx-list">
        <div className="pr-4 overflow-y-auto max-h-tx-list">
          <NotificationsList
            data={listOfTransactions}
            hasShowMore={page >= maxPage}
            showMore={showMore}
          />
        </div>
      </div>
    </ModalRegular>
  );
}

/**
 *
 * @param {{
 *  data: import('@/src/services/transactions/history').IHistoryEntry[],
 *  showMore: (event: any) => void,
 *  hasShowMore: boolean
 * }} prop
 * @returns
 */
function NotificationsList({ data, showMore, hasShowMore }) {
  const { networkId } = useNetwork();
  const { locale } = useRouter();

  if (data.length) {
    return (
      <>
        <div className="pt-2 w-96">
          {data.map((transaction) => (
            <Notification
              {...transaction}
              networkId={networkId}
              locale={locale}
              key={transaction.hash}
            />
          ))}
        </div>
        <div
          className={`text-center pb-3 mt-10 ${hasShowMore ? "hidden" : ""}`}
        >
          <a href="#" className="underline" onClick={showMore}>
            {t`View More`}
          </a>
        </div>
      </>
    );
  }

  return (
    <div className="block p-4 whitespace-nowrap">{t`No transaction history to show`}</div>
  );
}

/**
 * @param {import('@/src/services/transactions/history').IHistoryEntry & { networkId: string, locale: string }} prop
 */
function Notification({
  hash,
  methodName,
  timestamp,
  status,
  data,
  networkId,
  locale,
}) {
  const txLink = getTxLink(networkId, { hash });

  const { title, description } = getActionMessage(
    methodName,
    status,
    data,
    locale
  );

  return (
    <div className="flex py-4 border-b border-B0C4DB/40" key={hash}>
      <div className="mr-4">{convertToIconVariant(status)}</div>
      <div className="mr-4 grow">
        <p className="text-sm font-bold font-sora">{title}</p>
        <p>{description}</p>
        <p className="mt-2 text-xs leading-4 tracking-normal text-999BAB">
          {fromNow(timestamp / 1000)}
        </p>
      </div>
      <a
        className="flex items-center self-end text-xs whitespace-nowrap text-4289F2"
        href={txLink}
        target="_blank"
        rel="noreferrer"
      >
        {t`View Tx`} &gt;
      </a>
    </div>
  );
}
