import { Header } from "@/components/UI/organisms/header";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  if (pageProps.noWrappers) {
    return <Component {...pageProps} />;
  }

  return (
    <>
      <Header></Header>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
