import { Container } from "@/common/components/Container/Container";
import Link from "next/link";

export default function PageNotFound() {
  return (
    <div className="max-w-full bg-white">
      <Container className="flex flex-col items-center bg-top bg-no-repeat bg-contain py-28 sm:bg-auto bg-404-background bg-origin-content">
        <img src="/404.svg" alt="404 page not found" />
        <p className="py-3 my-12 font-bold leading-10 text-center font-sora text-xxxl">
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
