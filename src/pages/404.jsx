import { RegularButton } from "@/components/UI/atoms/button/regular";
import { Container } from "@/components/UI/atoms/container";
import Link from "next/link";

export default function PageNotFound() {
  return (
    <>
      <Container className="py-28 flex flex-col items-center">
        <img src="/404.png" alt="404 page not found" />
        <p className="font-sora text-header-large leading-10 font-bold text-center my-12 py-3">
          404
        </p>
        <p className="mb-11 text-h6">
          Oops! Looks like you’re heading to a wrong planet.
        </p>
        <Link href={"/"} passHref>
          <RegularButton
            className={"uppercase py-5 px-16 font-bold leading-8 tracking-wide"}
          >
            Take me back to homepage
          </RegularButton>
        </Link>
      </Container>
    </>
  );
}
