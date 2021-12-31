import { Container } from "@/components/UI/atoms/container";

export const getStaticProps = async () => {
  return {
    props: {
      noWrappers: true,
    },
  };
};

export default function PageNotAvailable() {
  return (
    <>
      <header className="bg-black text-EEEEEE px-8 py-6">
        <h1 className="text-h3 uppercase">Neptune Mutual</h1>
      </header>
      <Container className="py-28">
        <img
          src="/unavailable.png"
          alt="Access Denied"
          className="block w-52 h-52 mx-auto"
        />
        <h2 className="text-h3 leading-10 font-sora font-bold text-center my-6">
          Oops, Neptune Mutual is not available in your region
        </h2>
        <p className="text-9B9B9B text-center mt-2">
          Enter your email and we will notify when Neptune Mutual is available
        </p>
        <form className="mt-6 max-w-md mx-auto">
          <input
            type="email"
            name="email"
            id="email"
            required
            className="block w-full py-3 pl-4 border border-B0C4DB rounded-lg"
            placeholder="Enter email address"
          />
          <button
            type="submit"
            className="bg-4E7DD9 text-EEEEEE uppercase text-h5 font-bold mt-6 py-5 px-10 block w-full rounded-lg"
          >
            subscribe
          </button>
        </form>
      </Container>
    </>
  );
}
