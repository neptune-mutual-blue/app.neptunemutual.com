import { OutlinedCard } from "@/components/UI/molecules/outlined-card";
import { Divider } from "@/components/UI/atoms/divider";

export const CardSkeleton = ({
  numberOfCards = 1,
  statusBadge = true,
  subTitle = true,
  lineContent = 3,
}) => {
  const cardsArray = new Array(numberOfCards).fill(1); // convert number of card to array
  const lineContentArray = new Array(lineContent).fill(1); // convert number of line content to array

  return (
    <>
      {cardsArray.map((card, i) => (
        <OutlinedCard key={i} className="p-6 bg-white">
          <div className="flex justify-between animate-pulse">
            <div className="rounded-full h-14 lg:h-18 w-14 lg:w-18 bg-skeleton" />
            {statusBadge && (
              <div className="w-40 h-6 rounded-full bg-skeleton" />
            )}
          </div>
          <div className="w-3/5 h-5 mt-4 rounded-full bg-skeleton" />
          {subTitle && (
            <div className="w-2/4 h-4 mt-3 rounded-full bg-skeleton" />
          )}
          <Divider className="mb-4 lg:mb-8" />
          {lineContentArray.map((line, i) => (
            <div key={i} className="h-3 mt-3 rounded-full bg-skeleton" />
          ))}
        </OutlinedCard>
      ))}
    </>
  );
};
