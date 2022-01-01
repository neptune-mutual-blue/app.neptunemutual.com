import { Container } from "@/components/UI/atoms/container";

export const ReportingHero = ({ children }) => {
  return (
    <div
      style={{
        backgroundImage: "url(/gradient.png)",
        backgroundSize: "cover",
        backgroundPosition: "left",
      }}
    >
      <Container className="px-2 py-20">
        <h1 className="text-h2 font-sora font-bold">Reporting</h1>
      </Container>
      {children}
    </div>
  );
};
