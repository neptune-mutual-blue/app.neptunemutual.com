import Link from "next/link";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  if (pageProps.noWrappers) {
    return <Component {...pageProps} />;
  }

  return (
    <>
      <header className="bg-black text-white-fg px-8 py-6">
        <Link href="/">
          <a className="text-h3 uppercase">Neptune Mutual</a>
        </Link>
      </header>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
