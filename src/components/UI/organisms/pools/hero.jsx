import { PoolTotalValueLocked } from "@/components/UI/molecules/pools/pools-hero/total-value-locked";
import { Container } from "@/components/UI/atoms/container";

export const PoolHero = ({ children, title }) => {
  return (
    <div
      style={{
        backgroundImage: "url(/gradient.png)",
        backgroundSize: "cover",
        backgroundPosition: "left",
      }}
    >
      <Container className="px-2 flex py-20">
        <h1 className="text-h2 font-sora font-bold">{title}</h1>

        {/* Total Value Locked */}
        <PoolTotalValueLocked />
      </Container>
      {children}
    </div>
  );
};
