import { OutlinedCard } from "@/components/UI/molecules/outlined-card";

export const CoverActionCard = ({ children, title, description, imgSrc }) => {
  return (
    <OutlinedCard className="bg-FEFEFF p-10" type="link">
      <div className="flex items-center">
        <div className="mr-6">
          <div className="w-24 h-24 rounded-full bg-DEEAF6 p-4 flex justify-center items-center">
            <img
              src={imgSrc}
              alt={title}
              className="inline-block max-w-full max-h-full"
            />
          </div>
        </div>
        <div>
          <h4 className="text-h4 font-sora">{title}</h4>
          <p className="text-89A0C2 mt-1">{description}</p>
        </div>
      </div>
    </OutlinedCard>
  );
};
