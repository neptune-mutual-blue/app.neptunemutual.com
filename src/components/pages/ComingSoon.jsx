import { Container } from "@/components/UI/atoms/container";
import Link from "next/link";

export function ComingSoon() {
  return (
    <div className="bg-white max-w-full">
      <Container className="py-28 flex flex-col bg-contain sm:bg-auto items-center  bg-404-background bg-no-repeat bg-top bg-origin-content">
        <img src="/404.svg" alt="404 page not found" />
        <p className="font-sora text-xxl leading-10 font-bold text-center mt-12 mb-4 py-3">
          Coming soon!
        </p>
        <p className="mb-11 text-h5">
          Feature is yet to be released. Our team&#x2019;s getting it ready for
          you.
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
