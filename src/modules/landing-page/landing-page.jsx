import { Container } from "@/common/Container/Container";
import BasketCP from "@/modules/landing-page/assets/BasketCP";
import NeptuneLogo from "@/modules/landing-page/assets/NeptuneLogo";
import StandAloneCP from "@/modules/landing-page/assets/StandAloneCP";
import Card from "@/modules/landing-page/card";

export default function LandingPage() {
  return (
    <main className="flex flex-grow items-center justify-center flex-col h-100vh text-black bg-F1F3F6">
      <Container className="h-full flex items-center flex-col justify-center">
        <NeptuneLogo className="mb-8" />

        <h1 className="font-bold text-h1 mb-2">Select Product</h1>
        <p className="text-h5 font-normal">
          Lorem ipsum dolor sit amet, consectetur.
        </p>

        <div className="flex space-x-8 mt-20">
          <Card href="/">
            <Card.Logo>
              <StandAloneCP />
            </Card.Logo>

            <Card.Title>Standalone Cover Pool</Card.Title>
            <Card.Description>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </Card.Description>
          </Card>
          <Card href="/basket">
            <Card.Logo>
              <BasketCP />
            </Card.Logo>

            <Card.Title>Basket Cover Pool</Card.Title>
            <Card.Description>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </Card.Description>
          </Card>
        </div>
      </Container>
    </main>
  );
}
