import Head from "next/head";
import { Container } from "@/src/common/components/container";
import { HeaderLogo } from "@/src/common/components/HeaderLogo";

export const getStaticProps = async () => {
  return {
    props: {
      noWrappers: true,
    },
  };
};

export default function PageNotAvailable() {
  return (
    <main className="bg-white">
      <Head>
        <title>Not Available - Neptune Mutual Covers</title>
        <meta
          name="description"
          content="Get guaranteed payouts from our parametric cover model. Resolve incidents faster without the need for claims assessment."
        />
      </Head>
      <header className="px-8 py-6 bg-black text-EEEEEE">
        <HeaderLogo />
      </header>
      <Container className="py-28">
        <img
          src="/unavailable.svg"
          alt="Access Denied"
          className="block mx-auto w-52 h-52"
        />
        <h2 className="my-6 font-bold leading-10 text-center text-h3 font-sora">
          Oops, Neptune Mutual is not available in your region
        </h2>
        <p className="mt-2 text-center text-9B9B9B">
          Enter your email and we will notify when Neptune Mutual is available
        </p>
        <form className="max-w-md mx-auto mt-6">
          <input
            type="email"
            name="email"
            id="email"
            required
            className="block w-full py-3 pl-4 border rounded-lg border-B0C4DB"
            placeholder="Enter email address"
          />
          <button
            type="submit"
            className="block w-full px-10 py-5 mt-6 font-bold uppercase rounded-lg bg-4e7dd9 text-EEEEEE text-h5 font-sora"
          >
            subscribe
          </button>
        </form>
      </Container>
    </main>
  );
}
