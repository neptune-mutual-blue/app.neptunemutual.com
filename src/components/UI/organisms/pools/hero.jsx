import { PoolTotalValueLocked } from "@/components/UI/molecules/pools/pools-hero/total-value-locked";
import { Container } from "@/components/UI/atoms/container";

export const PoolHero = ({ children, title }) => {
  return (
    <div
      className="px-8 py-6"
      style={{
        backgroundImage: "url(/gradient.png)",
        backgroundSize: "cover",
        backgroundPosition: "left",
      }}
    >
      <div className="py-14">
        <Container>
          <div className="flex">
            <div>
              <div className="flex items-center">
                <h1 className="text-h2 font-sora font-bold">{title}</h1>
              </div>
            </div>

            {/* Total Value Locked */}
            <PoolTotalValueLocked />
          </div>
        </Container>
      </div>
    </div>
  );
};
