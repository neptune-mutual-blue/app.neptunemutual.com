import { Container } from "@/components/UI/atoms/container";
import Link from "next/link";

export default function PageNotFound() {
  return (
    <div className="bg-white max-w-full">
      <Container className="py-28 flex flex-col bg-contain sm:bg-auto items-center  bg-404-background bg-no-repeat bg-top bg-origin-content">
        <img src="/404.png" alt="404 page not found" />
        <p className="font-sora text-xxxl leading-10 font-bold text-center my-12 py-3">
          404
        </p>
        <p className="mb-11 text-h5">
          Oops! Looks like you&#x2019;re heading to a wrong planet.
        </p>
        <Link href={"/"} replace>
          <a
            className={
              "uppercase py-5 px-16 font-bold leading-8 tracking-wide text-EEEEEE border border-4e7dd9 rounded-lg bg-4e7dd9 focus:outline-none focus-visible:ring-2 focus-visible:ring-4e7dd9"
            }
          >
            Take me back to homepage
          </a>
        </Link>
      </Container>
    </div>
  );
}
