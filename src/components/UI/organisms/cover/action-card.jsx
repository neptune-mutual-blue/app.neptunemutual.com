import { OutlinedCard } from "@/components/UI/molecules/outlined-card";

export const CoverActionCard = ({ title, description, imgSrc }) => {
  return (
    <OutlinedCard className="bg-white p-4 sm:p-6 md:p-10" type="link">
      <div className="flex items-center">
        <div className="ml-2 md:ml-0 mr-4 md:mr-6">
          <div className="w-16 md:w-24 h-16 md:h-24 rounded-full bg-DEEAF6 p-4 flex justify-center items-center">
            <img
              src={imgSrc}
              alt={title}
              className="inline-block max-w-full max-h-full"
            />
          </div>
        </div>
        <div>
          <h4 className="text-h5 md:text-h4 font-sora">{title}</h4>
          <p className="text-sm md:text-h5 text-89A0C2 mt-1">{description}</p>
        </div>
      </div>
    </OutlinedCard>
  );
};
