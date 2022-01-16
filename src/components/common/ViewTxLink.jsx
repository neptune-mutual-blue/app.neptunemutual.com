import OpenInNewIcon from "@/icons/open-in-new";

export const ViewTxLink = ({ txLink }) => {
  return (
    <a className="flex" target="_blank" rel="noopener noreferrer" href={txLink}>
      <span className="inline-block">View transaction</span>
      <OpenInNewIcon className="h-4 w-4 ml-2" fill="currentColor" />
    </a>
  );
};
