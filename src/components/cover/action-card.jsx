import { OutlinedCard } from "@/components/common/outlined-card";
import { ImageContainer } from "@/components/common/image-container";

export const CoverActionCard = ({ children, title, description, imgSrc }) => {
  return (
    <OutlinedCard className="bg-white-bg p-10" type="link">
      <div className="flex items-center">
        <div className="mr-6">
          <ImageContainer size="md" className="bg-ash-brand p-2">
            <img src={imgSrc} alt={title} className="inline-block max-w-full" />
          </ImageContainer>
        </div>
        <div>
          <h4 className="text-h4 font-sora">{title}</h4>
          <p className="text-para text-ash-fg mt-1">{description}</p>
        </div>
      </div>
    </OutlinedCard>
  );
};
